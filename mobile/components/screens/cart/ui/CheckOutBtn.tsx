import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface CheckOutBtnProps {
    handleCheckout: () => void;
    paymentLoading : boolean;
}

const CheckOutBtn : React.FC<CheckOutBtnProps> = ({handleCheckout , paymentLoading}) => {
  return (
    <TouchableOpacity
      className="bg-primary rounded-2xl overflow-hidden"
      activeOpacity={0.9}
      onPress={handleCheckout}
      disabled={paymentLoading}
    >
      <View className="py-5 flex-row items-center justify-center">
        {paymentLoading ? (
          <ActivityIndicator size="small" color="#121212" />
        ) : (
          <>
            <Text className="text-background font-bold text-lg mr-2">
              Checkout
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#121212" />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CheckOutBtn;
