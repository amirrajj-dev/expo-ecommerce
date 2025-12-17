import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import { useOrders } from "@/hooks/queries/orders";
import { useCreateReview } from "@/hooks/mutations/create-review";
import { Order } from "@/types/interfaces/order.interface";
import Toast from "react-native-toast-message";
import { Product } from "@/types/interfaces/product.interface";
import EmptyState from "./ui/EmptyState";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import RatingModal from "./ui/RatingModal";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";

const Orders = () => {
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
  } = useOrders();
  const { mutateAsync: createReview, isPending: isPendingCreateReview } =
    useCreateReview();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productRatings, setProductRatings] = useState<{
    [key: string]: number;
  }>({});
  const orders = ordersData?.data || [];
  const handleOpenRating = (order: Order) => {
    setShowRatingModal(true);
    setSelectedOrder(order);
    // init ratings for all product to 0 - resettin the state for each product
    const initialRatings: { [key: string]: number } = {};
    order.items.forEach((item) => {
      const productId = (item.product as Product)._id;
      initialRatings[productId] = 0;
    });
    setProductRatings(initialRatings);
  };

  const handleSubmitRating = async () => {
    if (!selectedOrder) return;

    // check if all products have been rated
    const allRated = Object.values(productRatings).every(
      (rating) => rating > 0
    );
    if (!allRated) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please rate all products",
      });
      return;
    }

    try {
      await Promise.all(
        selectedOrder.items.map((item) => {
          createReview({
            productId: (item.product as Product)._id,
            orderId: selectedOrder._id,
            rating: productRatings[(item.product as Product)._id],
          });
        })
      );
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Thank you for rating all products!",
      });
      setShowRatingModal(false);
      setSelectedOrder(null);
      setProductRatings({});
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to submit rating",
      });
    }
  };

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "#10B981";
      case "shipped":
        return "#3B82F6";
      case "pending":
        return "#F59E0B";
      default:
        return "#666";
    }
  };
  return (
    <SafeScreen>
      {/* Header */}
      <View className="px-6 pb-5 m-4 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold">My Orders</Text>
      </View>

      {isLoadingOrders ? (
        <LoadingState text="Loading orders..." />
      ) : isErrorOrders ? (
        <ErrorState title="Failed to load orders" />
      ) : !orders || orders?.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {orders?.map((order) => {
              const totalItems = order.items.reduce(
                (sum, item) => sum + item.quantity,
                0
              );
              const firstImage = order.items[0]?.image || "";

              return (
                <View
                  key={order._id}
                  className="bg-surface rounded-3xl p-5 mb-4"
                >
                  <View className="flex-row mb-4">
                    <View className="relative">
                      <Image
                        source={{ uri: firstImage }}
                        style={{ height: 80, width: 80, borderRadius: 8 }}
                        contentFit="cover"
                      />

                      {/* BADGE FOR MORE ITEMS */}
                      {order?.items.length > 1 && (
                        <View className="absolute -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center">
                          <Text className="text-background text-xs font-bold">
                            +{order.items.length - 1}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className="flex-1 ml-4">
                      <Text className="text-text-primary font-bold text-base mb-1">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </Text>
                      <Text className="text-text-secondary text-sm mb-2">
                        {formatDate(order.createdAt as string)}
                      </Text>
                      <View
                        className="self-start px-3 py-1.5 rounded-full"
                        style={{
                          backgroundColor: getStatusColor(order.status) + "20",
                        }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: getStatusColor(order.status) }}
                        >
                          {capitalizeFirstLetter(order.status)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* ORDER ITEMS SUMMARY */}
                  {order?.items?.map((item, index) => (
                    <Text
                      key={item._id}
                      className="text-text-secondary text-sm flex-1"
                      numberOfLines={1}
                    >
                      {item.name} × {item.quantity}
                    </Text>
                  ))}

                  <View className="border-t border-background-lighter pt-3 flex-row justify-between items-center">
                    <View>
                      <Text className="text-text-secondary text-xs mb-1">
                        {totalItems} items
                      </Text>
                      <Text className="text-primary font-bold text-xl">
                        ${order.totalPrice}
                      </Text>
                    </View>

                    {order.status === "delivered" &&
                      (order.hasReviewed ? (
                        <View className="bg-primary/20 px-5 py-3 rounded-full flex-row items-center">
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#1DB954"
                          />
                          <Text className="text-primary font-bold text-sm ml-2">
                            Reviewed
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          className="bg-primary px-5 py-3 rounded-full flex-row items-center"
                          activeOpacity={0.7}
                          onPress={() => handleOpenRating(order)}
                        >
                          <Ionicons name="star" size={18} color="#121212" />
                          <Text className="text-background font-bold text-sm ml-2">
                            Leave Rating
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        order={selectedOrder}
        productRatings={productRatings}
        onSubmit={handleSubmitRating}
        isSubmitting={isPendingCreateReview}
        onRatingChange={(productId, rating) =>
          setProductRatings((prev) => ({ ...prev, [productId]: rating }))
        }
      />
    </SafeScreen>
  );
};

export default Orders;
