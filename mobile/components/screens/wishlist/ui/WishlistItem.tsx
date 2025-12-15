import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";

interface WishlistItemProps {
  title: string;
  productId: string;
  image: string;
  price: number;
  stock: number;
  isAddingToCart: boolean;
  cartQuantity: number;
  isInCart: boolean;
  isDeletingFromWishlist: boolean;
  onRemoveFromWishlist: (productId: string , productName: string) => void;
  onAddToCart: (prodcudtId: string) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  image,
  price,
  stock,
  title,
  productId,
  isInCart,
  cartQuantity = 0,
  onAddToCart,
  onRemoveFromWishlist,
  isAddingToCart,
  isDeletingFromWishlist,
}) => {
  const formattedPrice = `$${price}`;
  return (
    <TouchableOpacity
      onPress={() => router.push(`/products/${productId}`)}
      className="bg-surface px-6 py-4 rounded-3xl mb-3"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center justify-center gap-4">
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 10 }}
          />
          <View className="">
            <Text numberOfLines={2} className="text-white font-bold max-w-56">
              {title}
            </Text>
            <Text className="text-primary font-bold text-xl">
              {formattedPrice}
            </Text>
            {stock > 0 ? (
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Text className="text-green-500 text-sm font-semibold">
                  {stock} in stock
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                <Text className="text-red-500 text-sm font-semibold">
                  Out of Stock
                </Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          className="self-start bg-red-500/20 p-2 rounded-full"
          activeOpacity={0.7}
          onPress={() => onRemoveFromWishlist(productId , title)}
          disabled={isDeletingFromWishlist}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
      {stock > 0 && (
        <>
          {isInCart ? (
            <View className="flex-row items-center justify-center gap-2 mt-4 bg-green-500/20 rounded-xl py-3 px-4">
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text className="text-green-400 font-bold">Added to Cart</Text>
            </View>
          ) : (
            <TouchableOpacity
              className="bg-primary rounded-xl py-3 mt-4 items-center"
              activeOpacity={0.8}
              onPress={() => onAddToCart(productId)}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <Text className="text-background font-bold">Add to Cart</Text>
              )}
            </TouchableOpacity>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default WishlistItem;
