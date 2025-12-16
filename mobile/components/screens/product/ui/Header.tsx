import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface HeaderProps {
    isPendingAddToWishlist : boolean;
    isPendingDeleteFromWishlist : boolean;
    productId : string;
    isInWishlist: (productId: string) => boolean;
    toggleWishlist: (productId: string) => void
}

const Header : React.FC<HeaderProps> = ({isInWishlist , toggleWishlist , isPendingAddToWishlist , isPendingDeleteFromWishlist , productId}) => {
  return (
    <View className="absolute top-0 left-0 right-0 z-10 px-6 pt-20 pb-4 flex-row items-center justify-between">
      <TouchableOpacity
        className="bg-black/50 backdrop-blur-xl w-12 h-12 rounded-full items-center justify-center"
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-12 h-12 rounded-full items-center justify-center ${
          isInWishlist(productId)
            ? "bg-primary"
            : "bg-black/50 backdrop-blur-xl"
        }`}
        onPress={() => toggleWishlist(productId)}
        disabled={isPendingAddToWishlist || isPendingDeleteFromWishlist}
        activeOpacity={0.7}
      >
        {isPendingAddToWishlist || isPendingDeleteFromWishlist ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons
            name={isInWishlist(productId) ? "heart" : "heart-outline"}
            size={24}
            color={isInWishlist(productId) ? "#121212" : "#FFFFFF"}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Header;
