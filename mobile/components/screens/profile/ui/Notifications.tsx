import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Notifications = () => {
  return (
    <View className="mb-3 mx-6 bg-surface rounded-2xl p-4">
      <TouchableOpacity
        className="flex-row items-center justify-between py-2"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          <Text className="text-text-primary font-semibold ml-3">
            Notifications
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

export default Notifications;
