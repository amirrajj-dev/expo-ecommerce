import React from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (text: string) => void;
}

const SearchBar = ({ searchValue, onSearchChange }: SearchBarProps) => {
  return (
    <View className="relative">
      <TextInput
        placeholder="Search for products..."
        value={searchValue}
        onChangeText={onSearchChange}
        className="bg-background-lighter rounded-xl text-text-secondary placeholder:text-text-secondary py-4 px-11"
      />
      <Ionicons
        name="search-outline"
        className="absolute top-4 left-2.5"
        color={"#B3B3B3"}
        size={20}
      />
    </View>
  );
};

export default SearchBar;