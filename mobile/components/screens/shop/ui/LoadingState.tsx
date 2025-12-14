import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

const LoadingState = () => {
  return (
    <View className="py-10 items-center">
      <ActivityIndicator size="large" color="#1DB954" />
      <Text className="text-text-secondary mt-4">
        Loading products...
      </Text>
    </View>
  );
};

export default LoadingState;