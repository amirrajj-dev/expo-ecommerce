import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Header = () => {
  return (
    <View className="flex-row items-center justify-between mb-6">
      <View>
        <Text className="font-bold text-3xl tracking-tight text-text-primary">
          Shop
        </Text>
        <Text className="font-medium text-sm mt-1 text-text-secondary">
          Browse All Products
        </Text>
      </View>
      <View>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons
            name="options-outline"
            className="p-3 bg-surface/50 rounded-full"
            color={"#fff"}
            size={22}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;