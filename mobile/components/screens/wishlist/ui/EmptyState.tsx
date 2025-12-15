import SafeScreen from "@/components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const EmptyState = () => {
  return (
    <SafeScreen>
      <View className="px-6 pb-5 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold">Wishlist</Text>
        <Text className="text-text-secondary text-sm ml-auto">0 items</Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="heart-outline" size={80} color="#666" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          Your wishlist is empty
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Start adding products you love!
        </Text>
        <TouchableOpacity
          className="bg-primary rounded-2xl px-8 py-4 mt-6"
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)")}
        >
          <Text className="text-background font-bold text-base">
            Browse Products
          </Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
};

export default EmptyState;
