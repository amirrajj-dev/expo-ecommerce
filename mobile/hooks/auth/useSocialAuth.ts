import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { startSSOFlow } = useSSO();
  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    try {
      setIsLoading(true);
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.log("error in social auth => ", error);
      const provider = strategy === "oauth_apple" ? "apple" : "google";
      Alert.alert(
        "Error",
        `Failed to sign in with ${provider} please try again`
      );
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, handleSocialAuth };
};

export default useSocialAuth;
