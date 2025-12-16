import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { CartItem as CartItemI } from "@/types/interfaces/cart.interface";

interface CartItemProps {
    item : CartItemI;
    isPendingUpdateCart : boolean;
    isPendingDeleteFromCart : boolean;
    handleRemoveItem: (productId: string, productName: string) => void
    handleQuantityChange: (productId: string, currentQuantity: number, change: number) => void;
}

const CartItem : React.FC<CartItemProps> = ({isPendingUpdateCart , isPendingDeleteFromCart , item , handleQuantityChange , handleRemoveItem}) => {
  return (
    <View className="bg-surface rounded-3xl overflow-hidden ">
      <View className="p-4 flex-row">
        {/* product image */}
        <View className="relative">
          <Image
            source={{ uri: item.product.images[0].imageUrl }}
            className="bg-background-lighter"
            contentFit="cover"
            style={{ width: 112, height: 112, borderRadius: 16 }}
          />
          <View className="absolute top-2 right-2 bg-primary rounded-full px-2 py-0.5">
            <Text className="text-background text-xs font-bold">
              ×{item.quantity}
            </Text>
          </View>
        </View>

        <View className="flex-1 ml-4 justify-between">
          <View>
            <Text
              className="text-text-primary font-bold text-lg leading-tight"
              numberOfLines={2}
            >
              {item.product.name}
            </Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-primary font-bold text-2xl">
                ${item.product.price * item.quantity}
              </Text>
              <Text className="text-text-secondary text-sm ml-2">
                ${item.product.price} each
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-3">
            <TouchableOpacity
              className="bg-background-lighter rounded-full w-9 h-9 items-center justify-center"
              activeOpacity={0.7}
              onPress={() =>
                handleQuantityChange(item.product._id, item.quantity, -1)
              }
              disabled={isPendingUpdateCart}
            >
              {isPendingUpdateCart ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="remove-outline" size={18} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <View className="mx-4 min-w-[32px] items-center">
              <Text className="text-text-primary font-bold text-lg">
                {item.quantity}
              </Text>
            </View>

            <TouchableOpacity
              className="bg-primary rounded-full w-9 h-9 items-center justify-center"
              activeOpacity={0.7}
              onPress={() =>
                handleQuantityChange(item.product._id, item.quantity, 1)
              }
              disabled={isPendingUpdateCart}
            >
              {isPendingUpdateCart ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <Ionicons name="add" size={18} color="#121212" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="ml-auto bg-red-500/10 rounded-full w-9 h-9 items-center justify-center"
              activeOpacity={0.7}
              onPress={() =>
                handleRemoveItem(item.product._id, item.product.name)
              }
              disabled={isPendingDeleteFromCart}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
