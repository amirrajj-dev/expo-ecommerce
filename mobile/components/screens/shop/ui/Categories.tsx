import React from "react";
import { ScrollView, TouchableOpacity, Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { categories } from "@/data/data";

interface CategoriesProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const Categories = ({ selectedCategory, onCategorySelect }: CategoriesProps) => {
  return (
    <View className="mt-6">
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
      >
        <AllCategory 
          isSelected={selectedCategory === "All"}
          onPress={() => onCategorySelect("All")}
        />
        
        {categories.map(({ image, name }, index) => (
          <CategoryItem
            key={index + 1}
            image={image}
            name={name}
            isSelected={selectedCategory === name}
            onPress={() => onCategorySelect(name)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

interface AllCategoryProps {
  isSelected: boolean;
  onPress: () => void;
}

const AllCategory = ({ isSelected, onPress }: AllCategoryProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${isSelected ? "bg-primary" : "bg-surface"} rounded-xl size-20 items-center justify-center`}
    >
      <Ionicons
        name="grid-outline"
        size={36}
        color={isSelected ? "#000" : "#fff"}
      />
    </TouchableOpacity>
  );
};

interface CategoryItemProps {
  image: any;
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

const CategoryItem = ({ image, isSelected, onPress }: CategoryItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${isSelected ? "bg-primary" : "bg-surface"} rounded-xl size-20 items-center justify-center`}
    >
      <Image
        source={image}
        className="size-12"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default Categories;