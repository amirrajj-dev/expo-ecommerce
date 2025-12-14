import SafeScreen from "@/components/SafeScreen";
import { useUser } from "@clerk/clerk-expo";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { menuItems } from "@/data/data";
import Header from "./ui/Header";
import MenuItem from "./ui/MenuItem";
import Notifications from "./ui/Notifications";
import PrivacySecurity from "./ui/PrivacySecurity";
import Signout from "./ui/Signout";

const ProfileScreen = () => {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1DB954" />
          <Text className="text-text-secondary mt-4">Loading user...</Text>
        </View>
      </SafeScreen>
    );
  }

  const handleMenuPress = (action: (typeof menuItems)[number]["action"]) => {
    if (action === "/profile") return;
    router.push(action);
  };

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Header />
        <View className="flex-row flex-wrap gap-2 mx-6 mb-3">
          {menuItems.map((item, index) => (
            <MenuItem
              action={item.action}
              color={item.color}
              handleMenuPress={handleMenuPress}
              icon={item.icon}
              title={item.title}
              key={index + 1}
            />
          ))}
        </View>
        <Notifications />
        <PrivacySecurity />
        <Signout />
        <Text className="mx-6 mb-3 text-center text-text-secondary text-xs">
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeScreen>
  );
};

export default ProfileScreen;
