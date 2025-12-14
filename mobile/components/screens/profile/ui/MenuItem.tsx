import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { menuItems } from "@/data/data";

interface MenuItemProps {
    title : string;
    action: "/profile" | "/orders" | "/addresses" | "/wishlist"
    color:string;
    icon : string;
    handleMenuPress: (action: (typeof menuItems)[number]["action"]) => void
}

const MenuItem : React.FC<MenuItemProps> = ({action , color , icon , title , handleMenuPress}) => {
  return (
    <TouchableOpacity
      className="bg-surface rounded-2xl p-6 items-center justify-center"
      style={{ width: "48%" }}
      activeOpacity={0.7}
      onPress={() => handleMenuPress(action)}
    >
      <View
        className="rounded-full w-16 h-16 items-center justify-center mb-4"
        style={{ backgroundColor: color + "20" }}
      >
        <Ionicons name={icon as any} size={28} color={color} />
      </View>
      <Text className="text-text-primary font-bold text-base">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default MenuItem;
