import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import Toast from "react-native-toast-message";

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
      Toast.show({
        type : "error",
        text1 : "Error",
        text2 : `Failed to sign in with ${provider}. Please try again.`
      })
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { loadingStrategy, handleSocialAuth };
};

export default useSocialAuth;