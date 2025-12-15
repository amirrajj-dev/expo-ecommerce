import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const DeleteAccountBtn = () => {
  return (
    <View className="px-6 pt-4">
      <TouchableOpacity
        className="bg-surface rounded-2xl p-5 flex-row items-center justify-between border-2 border-red-500/20"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <View className="bg-red-500/20 rounded-full w-12 h-12 items-center justify-center mr-4">
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </View>
          <View>
            <Text className="text-red-500 font-bold text-base mb-1">
              Delete Account
            </Text>
            <Text className="text-text-secondary text-sm">
              Permanently delete your account
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
};

export default DeleteAccountBtn;
