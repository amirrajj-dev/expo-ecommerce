import {
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import { useLocalSearchParams } from "expo-router";
import { useProduct } from "@/hooks/queries/product";
import { Product as ProductI } from "@/types/interfaces/product.interface";
import LoadingState from "./ui/LoadingState";
import ErrorState from "./ui/ErrorState";
import { useAddToCart } from "@/hooks/mutations/add-to-cart";
import { useAddToWishlist } from "@/hooks/mutations/add-to-wishlist";
import { useDeleteFromWishlist } from "@/hooks/mutations/delete-from-wishlist";
import { useWishlist } from "@/hooks/queries/wishlist";
import { useCart } from "@/hooks/queries/cart";
import ImageGallary from "./ui/ImageGallary";
import ProductInfo from "./ui/ProductInfo";
import Header from "./ui/Header";
import ActionBar from "./ui/ActionBar";

const Product = () => {
  const { id: productId } = useLocalSearchParams<{id : string}>();
  const { mutate: addToCart, isPending: isPendingAddToCart } = useAddToCart();
  const { mutate: addToWishlist, isPending: isPendingAddToWishlist } =
    useAddToWishlist();
  const { mutate: deleteFromWishlist, isPending: isPendingDeleteFromWishlist } =
    useDeleteFromWishlist();
  const { data: wishlistData, isLoading: isLoadingWishlist } = useWishlist();
  const { data: cartData, isLoading: isLoadingCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const {
    data: productData,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
  } = useProduct(productId as string);
  const product = (productData?.data as ProductI) || [];
  const wishlist = wishlistData?.data || [];
  const cartItems = cartData?.data?.items || [];
  const inStock = product.stock > 0;

  const isInWishlist = (productId: string) => {
    return wishlist?.some((product) => product._id === productId) ?? false;
  };

  const getCartItemQuantity = (): number => {
    const cartItem = cartItems.find((item) => {
      return item.product._id === productId;
    });
    return cartItem?.quantity || 0;
  };

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      deleteFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ productId: product._id, quantity });
  };

  if (isLoadingProduct || isLoadingWishlist || isLoadingCart) {
    return <LoadingState />;
  }
  if (isErrorProduct) {
    return <ErrorState />;
  }
  return (
    <SafeScreen>
      <Header
        isInWishlist={isInWishlist}
        isPendingAddToWishlist={isPendingAddToWishlist}
        isPendingDeleteFromWishlist={isPendingDeleteFromWishlist}
        productId={product._id}
        toggleWishlist={toggleWishlist}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <ImageGallary
          images={product.images}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
        />
        <ProductInfo
          getCartItemQuantity={getCartItemQuantity}
          inStock={inStock}
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </ScrollView>

      {/* Bottom Action Bar */}
      <ActionBar
        getCartItemQuantity={getCartItemQuantity}
        handleAddToCart={handleAddToCart}
        inStock={inStock}
        isPendingAddToCart={isPendingAddToCart}
        price={product.price}
        quantity={quantity}
      />
    </SafeScreen>
  );
};

export default Product;
