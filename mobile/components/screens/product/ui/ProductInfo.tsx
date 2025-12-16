import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/types/interfaces/product.interface";

interface ProductInfoProps {
    product : Product;
    quantity : number;
    setQuantity : React.Dispatch<React.SetStateAction<number>>;
    inStock: boolean;
    getCartItemQuantity: () => number;
}

const ProductInfo : React.FC<ProductInfoProps> = ({product , quantity , inStock , getCartItemQuantity , setQuantity}) => {
  return (
    <View className="p-6">
      {/* Category */}
      <View className="flex-row items-center mb-3">
        <View className="bg-primary/20 px-3 py-1 rounded-full">
          <Text className="text-primary text-xs font-bold">
            {product.category}
          </Text>
        </View>
      </View>

      {/* Product Name */}
      <Text className="text-text-primary text-3xl font-bold mb-3">
        {product.name}
      </Text>

      {/* Rating & Reviews */}
      <View className="flex-row items-center mb-4">
        <View className="flex-row items-center bg-surface px-3 py-2 rounded-full">
          <Ionicons name="star" size={16} color="#FFC107" />
          <Text className="text-text-primary font-bold ml-1 mr-2">
            {product.averageRating.toFixed(1)}
          </Text>
          <Text className="text-text-secondary text-sm">
            ({product.totalReviews}{" "}
            {product.totalReviews > 0 ? "reviews" : "review"})
          </Text>
        </View>
        {inStock ? (
          <View className="ml-3 flex-row items-center">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <Text className="text-green-500 font-semibold text-sm">
              {product.stock} in stock
            </Text>
          </View>
        ) : (
          <View className="ml-3 flex-row items-center">
            <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
            <Text className="text-red-500 font-semibold text-sm">
              Out of Stock
            </Text>
          </View>
        )}
      </View>

      {/* Price */}
      <View className="flex-row items-center mb-6">
        <Text className="text-primary text-4xl font-bold">
          ${product.price}
        </Text>
      </View>

      {/* Quantity */}
      {getCartItemQuantity() === 0 && (
        <View className="mb-6">
          <Text className="text-text-primary text-lg font-bold mb-3">
            Quantity
          </Text>

          <View className="flex-row items-center">
            <TouchableOpacity
              className="bg-surface rounded-full w-12 h-12 items-center justify-center"
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              activeOpacity={0.7}
              disabled={!inStock}
            >
              <Ionicons
                name="remove"
                size={24}
                color={inStock ? "#FFFFFF" : "#666"}
              />
            </TouchableOpacity>

            <Text className="text-text-primary text-xl font-bold mx-6">
              {quantity}
            </Text>

            <TouchableOpacity
              className="bg-primary rounded-full w-12 h-12 items-center justify-center"
              onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
              activeOpacity={0.7}
              disabled={!inStock || quantity >= product.stock}
            >
              <Ionicons
                name="add"
                size={24}
                color={
                  !inStock || quantity >= product.stock ? "#666" : "#121212"
                }
              />
            </TouchableOpacity>
          </View>

          {quantity >= product.stock && inStock && (
            <Text className="text-orange-500 text-sm mt-2">
              Maximum stock reached
            </Text>
          )}
        </View>
      )}

      {/* Description */}
      <View className="mb-8">
        <Text className="text-text-primary text-lg font-bold mb-3">
          Description
        </Text>
        <Text className="text-text-secondary text-base leading-6">
          {product.description}
        </Text>
      </View>
    </View>
  );
};

export default ProductInfo;
