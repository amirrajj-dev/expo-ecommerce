import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const InfoAlert = () => {
  return (
    <View className="px-6 pt-6 pb-4">
      <View className="bg-primary/10 rounded-2xl p-4 flex-row">
        <Ionicons name="information-circle-outline" size={24} color="#1DB954" />
        <Text className="text-text-secondary text-sm ml-3 flex-1">
          We take your privacy seriously. Your data is encrypted and stored
          securely. You can manage your privacy settings at any time.
        </Text>
      </View>
    </View>
  );
};

export default InfoAlert;
