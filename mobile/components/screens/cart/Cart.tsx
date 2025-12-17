import { View, Text, Alert, ScrollView } from "react-native";
import React, { useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import { useCart } from "@/hooks/queries/cart";
import { useDeleteFromCart } from "@/hooks/mutations/delete-from-cart";
import { useUpdateCart } from "@/hooks/mutations/update-cart";
import { useClearCart } from "@/hooks/mutations/clear-cart";
import EmptyState from "./ui/EmptyState";
import { useAddresses } from "@/hooks/queries/addresses";
import { useStripe } from "@stripe/stripe-react-native";
import Toast from "react-native-toast-message";
import { Address } from "@/types/interfaces/user.interface";
import OrderSummary from "./ui/OrderSummary";
import CartItem from "./ui/CartItem";
import QuickStats from "./ui/QuickStats";
import CheckOutBtn from "./ui/CheckOutBtn";
import AddressSelectionModal from "./ui/AddressSelectionModal";
import { useApi } from "@/libs/axios";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";

const Cart = () => {
  const api = useApi();
  const [updateProductId, setUpdateProductId] = useState<string | null>(null);
  const {
    data: cartData,
    isLoading: isLoadingCart,
    isError: isErrorCart,
  } = useCart();
  const {
    data: addressesData,
    isError: isErrorAddresses,
    isLoading: isLoadingAddresses,
  } = useAddresses();
  const { mutate: deleteFromCart, isPending: isPendingDeleteFromCart } =
    useDeleteFromCart();
  const { mutate: updateCart, isPending: isPendingUpdateCart } = useUpdateCart(
    updateProductId as string
  );
  const { mutateAsync: clearCart } = useClearCart();
  const cartItems = cartData?.data?.items || [];
  const addresses = addressesData?.data || [];
  const cartTotal =
    cartItems?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) ?? 0;
  const tax = cartTotal * 0.08;
  const shipping = 10.0;
  const total = cartTotal + shipping + tax;
  const cartItemsCount =
    cartItems.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [addressModalVisible, setAddressModalVisible] =
    useState<boolean>(false);

  const handleQuantityChange = (
    productId: string,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      Toast.show({
        type: "info",
        text1: "Update Error",
        text2:
          "Can Not Update Quantity to something less than 1 (just delete it)",
      });
      return;
    }
    if (!productId) return;
    setUpdateProductId(productId);
    updateCart(newQuantity);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert("Remove Item", `Remove ${productName} From Cart ?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => deleteFromCart(productId),
      },
    ]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (!addresses || addresses.length === 0) {
      Toast.show({
        type: "info",
        text1: "No Address",
        text2:
          "Please Add a Shipping Address In Your Profile Before Checking Out",
      });
      return;
    }
    setAddressModalVisible(true);
  };

  const handleProceedWithPayment = async (selectedAddress: Address) => {
    setAddressModalVisible(false);
    try {
      setPaymentLoading(true);
      const { data } = await api.post("/payment/create-intent", {
        cartItems,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          streetAddress: selectedAddress.streetAddress,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          phoneNumber: selectedAddress.phoneNumber,
        },
      });
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: data.data.clientSecret,
        merchantDisplayName: "expo-ecommerce",
      });
      if (initError) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: initError.message,
        });
        setPaymentLoading(false);
      }
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: presentError.message,
        });
        setPaymentLoading(false);
        return;
      } else {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Your Payment Was Successfull! Your Order Is Being Proceed.",
        });
        clearCart();
      }
    } catch (error) {
      console.log("payment error => ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error instanceof Error ? error.message : "Failed to Process Payment",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  if (isLoadingCart || isLoadingAddresses)
    return (
      <LoadingState
        text="Loading cart..."
        containerClassName="flex-1 bg-background items-center justify-center"
      />
    );
  if (isErrorCart || isErrorAddresses)
    return (
      <ErrorState
        title="Failed to load cart"
        containerClassName="flex-1 bg-background items-center justify-center px-6"
      />
    );

  if (cartItems.length === 0) return <EmptyState />;
  return (
    <SafeScreen>
      <Text className="px-6 pb-5 text-text-primary text-3xl font-bold tracking-tight">
        Cart
      </Text>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 240 }}
      >
        <View className="px-6 gap-3">
          {cartItems.map((item, index) => (
            <CartItem
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
              key={item._id}
              item={item}
              isPendingDeleteFromCart={isPendingDeleteFromCart}
              isPendingUpdateCart={isPendingUpdateCart}
            />
          ))}
        </View>

        <OrderSummary
          cartTotal={cartTotal}
          shipping={shipping}
          tax={tax}
          total={total}
        />
      </ScrollView>
      <View
        className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t
       border-surface pt-4 pb-32 px-6"
      >
        <QuickStats cartItemsCount={cartItemsCount} total={total} />
        <CheckOutBtn
          handleCheckout={handleCheckout}
          paymentLoading={paymentLoading}
        />
      </View>
      <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleProceedWithPayment}
        isProcessing={paymentLoading}
      />
    </SafeScreen>
  );
};

export default Cart;
