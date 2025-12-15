import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const AccountSettings = () => {
  const accountSettings = [
    {
      id: "activity",
      icon: "time-outline",
      title: "Account Activity",
      description: "View recent login activity",
    },
    {
      id: "devices",
      icon: "phone-portrait-outline",
      title: "Connected Devices",
      description: "Manage devices with access",
    },
    {
      id: "data-download",
      icon: "download-outline",
      title: "Download Your Data",
      description: "Get a copy of your data",
    },
  ];

  return (
    <View className="px-6 pt-4">
      <Text className="text-text-primary text-lg font-bold mb-4">Account</Text>

      {accountSettings.map((setting) => (
        <TouchableOpacity
          key={setting.id}
          className="bg-surface rounded-2xl p-4 mb-3"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-4">
              <Ionicons name={setting.icon as any} size={24} color="#1DB954" />
            </View>
            <View className="flex-1">
              <Text className="text-text-primary font-bold text-base mb-1">
                {setting.title}
              </Text>
              <Text className="text-text-secondary text-sm">
                {setting.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AccountSettings;
