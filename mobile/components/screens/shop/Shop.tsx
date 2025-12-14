import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import SafeScreen from "@/components/SafeScreen";
import { useProducts } from "@/hooks/queries/products";
import Header from "./ui/Header";
import SearchBar from "./ui/SearchBar";
import Categories from "./ui/Categories";
import ProductsSection from "./ui/ProductsSection";

const Shop = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { data: productsData, isLoading : isLoadingProducts, error } = useProducts();
  const products = productsData?.data || [];
   const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchValue === "" ||
      product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      product.description.toLowerCase().includes(searchValue.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pb-4 pt-6">
          <Header />
          <SearchBar searchValue={searchValue} onSearchChange={setSearchValue} />
          <Categories selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
          <ProductsSection
            products={filteredProducts}
            isLoading={isLoadingProducts}
            error={error}
            searchValue={searchValue}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default Shop;