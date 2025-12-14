import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";

const Signout = () => {
    const {signOut} = useAuth()
  return (
    <TouchableOpacity
      className="mx-6 mb-3 bg-surface rounded-2xl py-5 flex-row items-center justify-center border-2 border-red-500/20"
      activeOpacity={0.8}
      onPress={() => signOut()}
    >
      <Ionicons name="log-out-outline" size={22} color="#EF4444" />
      <Text className="text-red-500 font-bold text-base ml-2">Sign Out</Text>
    </TouchableOpacity>
  );
};

export default Signout;
