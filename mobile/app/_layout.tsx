import { Stack } from "expo-router";
import "../global.css";
import TanStackQueryProvider from "@/providers/tanstack-provider";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/toast/ToastConfig";
import { StripeProvider } from "@stripe/stripe-react-native";

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <TanStackQueryProvider>
        <StripeProvider publishableKey={publishableKey as string} >
          <Stack screenOptions={{ headerShown: false }} />
        </StripeProvider>
        <Toast config={toastConfig} />
      </TanStackQueryProvider>
    </ClerkProvider>
  );
}
