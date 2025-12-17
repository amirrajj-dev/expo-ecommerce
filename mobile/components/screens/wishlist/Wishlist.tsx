import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import React from "react";
import SafeScreen from "@/components/SafeScreen";
import { useDeleteFromWishlist } from "@/hooks/mutations/delete-from-wishlist";
import { useAddToCart } from "@/hooks/mutations/add-to-cart";
import { useWishlist } from "@/hooks/queries/wishlist";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import WishlistItem from "./ui/WishlistItem";
import { useCart } from "@/hooks/queries/cart";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";

const Wishlist = () => {
  const { mutate: deleteFromWishlist, isPending: isPendingDeleteFromWishlist } =
    useDeleteFromWishlist();
  const { mutate: addToCart, isPending: isPendingAddToCart } = useAddToCart();
  const {
    data: wishlistData,
    isLoading: isLoadingWishlist,
    isError: isWishlistError,
  } = useWishlist();
  const {
    data: cartData,
    isLoading: isLoadingCart,
    isError: isCartError,
  } = useCart();

  if (isLoadingWishlist || isLoadingCart) {
    return (
      <LoadingState
        useSafeScreen
        text="Loading wishlist..."
        header={
          <View className="px-6 pb-5 m-4 border-b border-surface flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-text-primary text-2xl font-bold">
              Wishlist
            </Text>
          </View>
        }
      />
    );
  }

  if (isWishlistError || isCartError) {
    return (
      <ErrorState
        useSafeScreen
        title="Failed to load wishlist"
        header={
          <View className="px-6 pb-5 border-b border-surface flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text className="text-text-primary text-2xl font-bold">
              Wishlist
            </Text>
          </View>
        }
      />
    );
  }

  const wishlist = wishlistData?.data || [];
  const cartItems = cartData?.data?.items || [];

  if (wishlist.length === 0) {
    return (
      <EmptyState
        useSafeScreen
        title="Your wishlist is empty"
        description="Start adding products you love!"
        iconName="heart-outline"
        actionLabel="Browse Products"
        onActionPress={() => router.push("/(tabs)")}
        header={
          <View className="px-6 pb-5 border-b border-surface flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-text-primary text-2xl font-bold">
              Wishlist
            </Text>
            <Text className="text-text-secondary text-sm ml-auto">0 items</Text>
          </View>
        }
      />
    );
  }

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    Alert.alert("Remove From Wishlist", `Remove ${productName} From Wishlist`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => deleteFromWishlist(productId),
      },
    ]);
  };

  const handleAddToCart = (productId: string) => {
    addToCart({ productId, quantity: 1 });
  };

  return (
    <SafeScreen>
      <View className="m-4 gap-8">
        <View className="px-6 pb-5 border-b border-surface flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-text-primary text-2xl font-bold">Wishlist</Text>
          <Text className="text-text-secondary text-sm ml-auto">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
          </Text>
        </View>
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => {
            const inCart = cartItems.some(
              (cartItem) => cartItem.product._id === item._id
            );
            const cart = cartItems.find(
              (cart) => cart.product._id === item._id
            );
            return (
              <WishlistItem
                key={item._id}
                image={item.images[0].imageUrl}
                price={item.price}
                stock={item.stock}
                title={item.name}
                productId={item._id}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onAddToCart={handleAddToCart}
                isAddingToCart={isPendingAddToCart}
                isDeletingFromWishlist={isPendingDeleteFromWishlist}
                isInCart={inCart}
                cartQuantity={inCart ? (cart?.quantity as number) : 0}
              />
            );
          }}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
        />
      </View>
    </SafeScreen>
  );
};

export default Wishlist;
