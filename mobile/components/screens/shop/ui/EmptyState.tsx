import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  searchValue: string;
}

const EmptyState = ({ searchValue }: EmptyStateProps) => {
  return (
    <View className="py-10 items-center">
      <Ionicons name="search-outline" size={48} color="#B3B3B3" />
      <Text className="text-white mt-4">No products found</Text>
      <Text className="text-text-secondary text-center mt-2">
        {searchValue
          ? `No results for "${searchValue}"`
          : "No products available"}
      </Text>
    </View>
  );
};

export default EmptyState;