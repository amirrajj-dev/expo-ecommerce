import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import SafeScreen from "@/components/SafeScreen";

type LoadingStateProps = {
  text?: string;
  useSafeScreen?: boolean;
  header?: React.ReactNode;
  fullScreen?: boolean;
  containerClassName?: string;
};

const LoadingState = ({
  text = "Loading...",
  useSafeScreen = false,
  header,
  fullScreen = true,
  containerClassName = "",
}: LoadingStateProps) => {
  const Content = (
    <View className={containerClassName || (fullScreen
      ? "flex-1 items-center justify-center"
      : "py-10 items-center")}
    >
      <ActivityIndicator size="large" color="#1DB954" />
      <Text className="text-text-secondary mt-4">{text}</Text>
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

export default LoadingState;
