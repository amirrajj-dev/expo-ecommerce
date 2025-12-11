import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SocialAuthProps {
  label: string;
  disabled: boolean;
  loading?: boolean;
  onPress: () => void;
  icon: ImageSourcePropType;
}

const SocialButton = ({ onPress, disabled, loading, icon, label }: SocialAuthProps) => {
  return (
    <TouchableOpacity
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        opacity: disabled ? 0.75 : 1,
      }}
      className="border border-gray-200 bg-white px-6 py-3 rounded-full flex-row items-center justify-center"
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={label.includes("Apple") ? "#000" : "#4285f4"}
        />
      ) : (
        <View className="flex-row items-center justify-center">
          <Image resizeMode="contain" source={icon} className="size-8 mr-3" />
          <Text className="text-black font-medium text-base">{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SocialButton;