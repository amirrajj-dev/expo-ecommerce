import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@/components/SafeScreen";

type ErrorStateProps = {
  title?: string;
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

const ErrorState = ({
  title = "Something went wrong",
  description = "Please check your connection and try again",
  iconName = "alert-circle-outline",
  iconSize = 64,
  iconColor = "#FF6B6B",
  useSafeScreen = false,
  header,
  actionLabel,
  onActionPress,
  fullScreen = true,
  containerClassName = "",
}: ErrorStateProps) => {
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
          className="bg-primary rounded-2xl px-6 py-3 mt-6"
          onPress={onActionPress}
        >
          <Text className="text-background font-bold">
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

export default ErrorState;
