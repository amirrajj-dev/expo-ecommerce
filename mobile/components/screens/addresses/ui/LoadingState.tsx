import SafeScreen from "@/components/SafeScreen";
import AddressesHeader from "./AddressFormHeader";
import { ActivityIndicator, Text, View } from "react-native";

const LoadingState = ()=> {
  return (
    <SafeScreen>
      <AddressesHeader />
      <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" color="#1DB954" />
        <Text className="text-text-secondary mt-4">Loading addresses...</Text>
      </View>
    </SafeScreen>
  );
}

export default LoadingState;