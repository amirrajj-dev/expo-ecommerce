import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const EmptyState = () => {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Ionicons name="receipt-outline" size={80} color="#666" />
      <Text className="text-text-primary font-semibold text-xl mt-4">
        No orders yet
      </Text>
      <Text className="text-text-secondary text-center mt-2">
        Your order history will appear here
      </Text>
    </View>
  );
};

export default EmptyState;
