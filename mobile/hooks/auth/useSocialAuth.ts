import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

export type SocialStrategy = "oauth_google" | "oauth_apple";

const useSocialAuth = () => {
  const [loadingStrategy, setLoadingStrategy] = useState<SocialStrategy | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: SocialStrategy) => {
    try {
      setLoadingStrategy(strategy);

      const { createdSessionId, setActive } = await startSSOFlow({ strategy });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.log("error in social auth => ", error);

      const provider = strategy === "oauth_apple" ? "Apple" : "Google";
      Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { loadingStrategy, handleSocialAuth };
};

export default useSocialAuth;