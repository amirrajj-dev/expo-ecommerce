import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Address as AddressI } from "@/types/interfaces/user.interface";
import { Ionicons } from "@expo/vector-icons";

interface AddressProps {
  address: AddressI;
  selectedAddress: AddressI | null;
  setSelectedAddress: React.Dispatch<React.SetStateAction<AddressI | null>>;
}

const Address : React.FC<AddressProps> = ({address , selectedAddress , setSelectedAddress}) => {
  return (
    <TouchableOpacity
      key={address._id}
      className={`bg-surface rounded-3xl p-6 border-2 ${
        selectedAddress?._id === address._id
          ? "border-primary"
          : "border-background-lighter"
      }`}
      activeOpacity={0.7}
      onPress={() => setSelectedAddress(address)}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-3">
            <Text className="text-primary font-bold text-lg mr-2">
              {address.label}
            </Text>
            {address.isDefault && (
              <View className="bg-primary/20 rounded-full px-3 py-1">
                <Text className="text-primary text-sm font-semibold">
                  Default
                </Text>
              </View>
            )}
          </View>
          <Text className="text-text-primary font-semibold text-lg mb-2">
            {address.fullName}
          </Text>
          <Text className="text-text-secondary text-base leading-6 mb-1">
            {address.streetAddress}
          </Text>
          <Text className="text-text-secondary text-base mb-2">
            {address.city}, {address.state} {address.zipCode}
          </Text>
          <Text className="text-text-secondary text-base">
            {address.phoneNumber}
          </Text>
        </View>
        {selectedAddress?._id === address._id && (
          <View className="bg-primary rounded-full p-2 ml-3">
            <Ionicons name="checkmark" size={24} color="#121212" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Address;
