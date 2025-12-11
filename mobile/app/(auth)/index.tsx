import {
  View,
  Text,
  Image,
} from "react-native";
import React from "react";
import useSocialAuth from "@/hooks/auth/useSocialAuth";
import SocialButton from "@/components/auth/Socialbutton";

const AuthScreen = () => {
  const { handleSocialAuth, isLoading } = useSocialAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <Image
        resizeMode="contain"
        source={require("../../assets/images/auth-image.png")}
        className="size-96"
      />

      <View className="w-full max-w-[340px] gap-3 mt-4">
        <SocialButton
          disabled={isLoading}
          onPress={() => handleSocialAuth("oauth_google")}
          icon={require("../../assets/images/google.png")}
          label="Continue With Google"
        />

        <SocialButton
          disabled={isLoading}
          onPress={() => handleSocialAuth("oauth_apple")}
          icon={require("../../assets/images/apple.png")}
          label="Continue With Apple"
        />
      </View>

      <Text className="text-center mt-6 px-4 text-gray-500 font-medium text-sm max-w-80 leading-5">
        By signing up you agree to our{" "}
        <Text className="text-blue-500">Terms, Privacy Policy</Text> and{" "}
        <Text className="text-blue-500">Cookie Use</Text>.
      </Text>
    </View>
  );
};

export default AuthScreen;
