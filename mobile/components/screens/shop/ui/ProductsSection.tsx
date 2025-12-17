import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import Product from "@/components/screens/shop/ui/Product";
import type { Product as ProductType } from "@/types/interfaces/product.interface";
import { useWishlist } from "@/hooks/queries/wishlist";
import { useAddToWishlist } from "@/hooks/mutations/add-to-wishlist";
import { useDeleteFromWishlist } from "@/hooks/mutations/delete-from-wishlist";
import { useCart } from "@/hooks/queries/cart"; // Add this
import { useAddToCart } from "@/hooks/mutations/add-to-cart"; // Add this
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";

interface ProductsSectionProps {
  products: ProductType[];
  isLoading: boolean;
  error: any;
  searchValue: string;
}

const ProductsSection = ({
  products,
  isLoading,
  error,
  searchValue,
}: ProductsSectionProps) => {
  return (
    <View className="gap-4 mt-6">
      <SectionHeader productCount={products.length} />

      {isLoading ? (
        <LoadingState text="Loading products..." fullScreen={false} />
      ) : error ? (
        <ErrorState
          title="Failed to load products"
          description={error?.message || "Please check your connection"}
          iconSize={48}
          fullScreen={false}
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description={
            searchValue
              ? `No results for "${searchValue}"`
              : "No products available"
          }
          iconName="search-outline"
          iconSize={48}
          iconColor="#B3B3B3"
          fullScreen={false}
        />
      ) : (
        <ProductsGrid products={products} />
      )}
    </View>
  );
};

interface SectionHeaderProps {
  productCount: number;
}

const SectionHeader = ({ productCount }: SectionHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-white font-bold text-2xl">Products</Text>
      <Text className="text-text-secondary font-medium">
        {productCount} {productCount === 1 ? "item" : "items"}
      </Text>
    </View>
  );
};

interface ProductsGridProps {
  products: ProductType[];
}

const ProductsGrid = ({ products }: ProductsGridProps) => {
  const { data: wishlistData, isLoading: isLoadingWishlist } = useWishlist();
  const { data: cartData } = useCart();

  const { mutate: addToWishList, isPending: isPendingAddToWishlist } =
    useAddToWishlist();
  const { mutate: deleteFromWishlist, isPending: isPendingDeleteFromWishlist } =
    useDeleteFromWishlist();
  const { mutate: addToCart, isPending: isPendingAddToCart } = useAddToCart(); // Add cart mutation
  const [toggledProductId, setToggledProductId] = useState<null | string>(null);
  const [addingToCartProductId, setAddingToCartProductId] = useState<
    null | string
  >(null);
  const wishlist = wishlistData?.data || [];
  const cartItems = cartData?.data?.items || [];

  const isTogglingWishlist =
    isPendingAddToWishlist || isPendingDeleteFromWishlist;

  const getCartItemQuantity = (productId: string): number => {
    const cartItem = cartItems.find((item) => {
      return item.product._id === productId;
    });
    return cartItem?.quantity || 0;
  };

  const handleToggleWishlist = (productId: string, isInWishlist: boolean) => {
    if (isInWishlist) {
      deleteFromWishlist(productId);
    } else {
      addToWishList(productId);
    }
  };

  const handleAddToCart = (productId: string) => {
    addToCart({ productId, quantity: 1 });
  };

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <Product
          product={item}
          wishlist={wishlist}
          toggledProductId={toggledProductId}
          setToggledProductId={setToggledProductId}
          addingToCartProductId={addingToCartProductId}
          setAddingToCartProductId={setAddingToCartProductId}
          cartQuantity={getCartItemQuantity(item._id)}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          isTogglingWishlist={isTogglingWishlist}
          isLoadingWishlist={isLoadingWishlist}
          isAddingToCart={isPendingAddToCart}
        />
      )}
      numColumns={2}
      scrollEnabled={false}
      contentContainerStyle={{ gap: 16 }}
      columnWrapperStyle={{
        justifyContent: "space-between",
        gap: 16,
      }}
    />
  );
};

export default ProductsSection;
