import { Stack } from "expo-router";
import "../global.css";
import TanStackQueryProvider from "@/providers/tanstack-provider";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache'

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} >
      <TanStackQueryProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </TanStackQueryProvider>
    </ClerkProvider>
  );
}
