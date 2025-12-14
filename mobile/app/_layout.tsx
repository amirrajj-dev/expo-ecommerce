import { Stack } from "expo-router";
import "../global.css";
import TanStackQueryProvider from "@/providers/tanstack-provider";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/toast/ToastConfig";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} >
      <TanStackQueryProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast config={toastConfig} />
      </TanStackQueryProvider>
    </ClerkProvider>
  );
}
