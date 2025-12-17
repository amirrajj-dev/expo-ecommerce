import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@/components/SafeScreen";

type EmptyStateProps = {
  title: string;
  description?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  useSafeScreen?: boolean;
  header?: React.ReactNode;
  actionLabel?: string;
  onActionPress?: () => void;
  fullScreen?: boolean;
  containerClassName?: string;
};

const EmptyState = ({
  title,
  description,
  iconName = "cube-outline",
  iconSize = 80,
  iconColor = "#666",
  useSafeScreen = false,
  header,
  actionLabel,
  onActionPress,
  fullScreen = true,
  containerClassName = "",
}: EmptyStateProps) => {
  const Content = (
    <View
      className={
        containerClassName ||
        (fullScreen
          ? "flex-1 items-center justify-center px-6"
          : "py-10 items-center px-6")
      }
    >
      <Ionicons name={iconName} size={iconSize} color={iconColor} />

      <Text className="text-text-primary font-semibold text-xl mt-4 text-center">
        {title}
      </Text>

      {!!description && (
        <Text className="text-text-secondary text-center mt-2">
          {description}
        </Text>
      )}

      {actionLabel && onActionPress && (
        <TouchableOpacity
          className="bg-primary rounded-2xl px-8 py-4 mt-6"
          activeOpacity={0.8}
          onPress={onActionPress}
        >
          <Text className="text-background font-bold text-base">
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (useSafeScreen) {
    return (
      <SafeScreen>
        {header}
        {Content}
      </SafeScreen>
    );
  }

  return (
    <>
      {header}
      {Content}
    </>
  );
};

export default EmptyState;