import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const QuickStats = ({
  cartItemsCount,
  total,
}: {
  cartItemsCount: number;
  total: number;
}) => {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center">
        <Ionicons name="cart" size={20} color="#1DB954" />
        <Text className="text-text-secondary ml-2">
          {cartItemsCount} {cartItemsCount === 1 ? "item" : "items"}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-text-primary font-bold text-xl">${total}</Text>
      </View>
    </View>
  );
};

export default QuickStats;
