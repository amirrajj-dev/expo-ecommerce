import React from "react";
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {BlurView} from 'expo-blur'
import { StyleSheet } from "react-native";

const TabsLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();
  if (!isLoaded) {
    return null;
  }
  if (!isSignedIn) {
    return <Redirect href={"/(auth)"} />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown : false,
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "#B3B3B3",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: 32 + insets.bottom,
          paddingTop: 4,
          marginHorizontal: 100,
          marginBottom: insets.bottom,
          borderRadius: 24,
          overflow: "hidden",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 600,
        },
        tabBarBackground() {
          return (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          )
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Shop",
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "grid" : "grid-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "cart" : "cart-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "person" : "person-outline"}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
