import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import SafeScreen from "@/components/SafeScreen";

const LoadingState = () => {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
        <Text className="text-text-secondary mt-4">Loading product...</Text>
      </View>
    </SafeScreen>
  );
};

export default LoadingState;
