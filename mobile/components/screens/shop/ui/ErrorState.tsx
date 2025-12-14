import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorStateProps {
  error: any;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <View className="py-10 items-center">
      <Ionicons
        name="alert-circle-outline"
        size={48}
        color="#e45151"
      />
      <Text className="text-white mt-4">Failed to load products</Text>
      <Text className="text-text-secondary text-center mt-2">
        {error?.message || "Please check your connection"}
      </Text>
    </View>
  );
};

export default ErrorState;