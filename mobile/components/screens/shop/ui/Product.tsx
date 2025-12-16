import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Product as ProductI } from "@/types/interfaces/product.interface";
import { router } from "expo-router";
import { Image } from "expo-image";

interface ProductProps {
  product: ProductI;
  wishlist: ProductI[];
  cartQuantity: number;
  toggledProductId: string | null;
  setToggledProductId: React.Dispatch<React.SetStateAction<string | null>>;
  addingToCartProductId: string | null;
  setAddingToCartProductId: React.Dispatch<React.SetStateAction<string | null>>;
  onToggleWishlist: (productId: string, isInWishlist: boolean) => void;
  onAddToCart: (productId: string) => void;
  isTogglingWishlist?: boolean;
  isLoadingWishlist: boolean;
  isAddingToCart?: boolean;
}

const Product = ({
  product,
  wishlist,
  cartQuantity,
  onToggleWishlist,
  toggledProductId,
  setToggledProductId,
  addingToCartProductId,
  setAddingToCartProductId,
  onAddToCart,
  isTogglingWishlist = false,
  isLoadingWishlist,
  isAddingToCart = false,
}: ProductProps) => {
  const imageUrl =
    product.images[0]?.imageUrl ||
    "https://shopunipaq.com/images/product_placeholder.jpg";

  const formattedPrice = `$${product.price}`;
  const rating = product.averageRating || 0;
  const reviewsCount = product.totalReviews || 0;
  const isInWishlist = isLoadingWishlist
    ? false
    : wishlist?.some((wishlistProduct) => wishlistProduct._id === product._id);

  const handleWishlistToggle = () => {
    setToggledProductId(product._id);
    onToggleWishlist(product._id, isInWishlist);
  };

  const handleAddToCart = () => {
    setAddingToCartProductId(product._id);
    onAddToCart(product._id);
  };

  const isProductInCart = cartQuantity > 0;
  const isOutOfStock = product.stock === 0;
  const isMaxStockReached = cartQuantity >= product.stock;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/products/${product._id}`)}
      className="bg-surface rounded-3xl overflow-hidden flex-1  border border-gray-800 shadow-lg"
    >
      <View className="relative">
        {/* Wishlist Button */}
        <TouchableOpacity
          className="absolute top-4 right-4 bg-black/40 p-2.5 rounded-full z-10 backdrop-blur-sm"
          onPress={handleWishlistToggle}
          activeOpacity={0.7}
          disabled={isTogglingWishlist}
        >
          {isTogglingWishlist && toggledProductId === product._id ? (
            <ActivityIndicator color={"#fff"} />
          ) : isInWishlist ? (
            <Ionicons name="heart" size={22} color={"#e45151"} />
          ) : (
            <Ionicons name="heart-outline" size={22} color={"#fff"} />
          )}
        </TouchableOpacity>

        {/* Cart Quantity Badge */}
        {isProductInCart && !isOutOfStock && (
          <View className="absolute top-4 left-4 bg-primary/90 px-3 py-1 rounded-full z-10">
            <Text className="text-white text-xs font-bold">
              {cartQuantity} in cart
            </Text>
          </View>
        )}

        {/* Stock Indicator - Show only if not showing cart badge */}
        {!isProductInCart && product.stock <= 5 && product.stock > 0 && (
          <View className="absolute top-4 left-4 bg-red-500/90 px-2 py-1 rounded-lg z-10">
            <Text className="text-white text-xs font-bold">
              {product.stock === 1 ? "Last one!" : `Only ${product.stock} left`}
            </Text>
          </View>
        )}

        {product.stock === 0 && (
          <View className="absolute top-4 left-4 bg-gray-700/90 px-2 py-1 rounded-lg z-10">
            <Text className="text-white text-xs font-bold">Out of stock</Text>
          </View>
        )}

        {/* Product Image */}
        <View className="relative">
          <Image
            source={{ uri: imageUrl }}
            style={{ width: "100%", height: 224 }}
            contentFit="cover"
            placeholder={{
              uri: "https://shopunipaq.com/images/product_placeholder.jpg",
            }}
            placeholderContentFit="cover"
            transition={300}
          />
        </View>

        {/* Product Info */}
        <View className="p-5">
          {/* Category */}
          <Text className="text-sm text-text-secondary font-medium uppercase tracking-wider mb-1">
            {product.category}
          </Text>

          {/* Product Name */}
          <Text
            numberOfLines={2}
            className="text-white text-lg font-bold mb-3 leading-6"
          >
            {product.name}
          </Text>

          {/* Rating Row */}
          {reviewsCount > 0 ? (
            <View className="flex-row items-center mb-4">
              <View className="flex-row items-center mr-2 bg-yellow-500/10 px-2 py-1 rounded-lg">
                <Ionicons name="star" size={14} color={"#d3bc4b"} />
                <Text className="text-white font-bold ml-1 text-sm">
                  {rating.toFixed(1)}
                </Text>
              </View>
              <Text className="text-sm text-text-secondary font-medium">
                ({reviewsCount} {reviewsCount === 1 ? "review" : "reviews"})
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center mb-4">
              <Text className="text-sm text-text-secondary font-medium">
                No reviews yet
              </Text>
            </View>
          )}

          {/* Price & Add to Cart */}
          <View className="flex-row items-center justify-between pt-3">
            <Text className="text-2xl font-bold text-primary">
              {formattedPrice}
            </Text>

            <TouchableOpacity
              className={`${
                isProductInCart
                  ? "bg-green-600"
                  : isOutOfStock || isMaxStockReached
                    ? "bg-gray-600"
                    : "bg-primary"
              } rounded-full p-2 active:opacity-90 shadow-md shadow-primary/30 disabled:opacity-50`}
              onPress={handleAddToCart}
              activeOpacity={0.8}
              disabled={
                isOutOfStock ||
                isMaxStockReached ||
                isAddingToCart ||
                isProductInCart
              }
            >
              {isAddingToCart && addingToCartProductId === product._id ? (
                <ActivityIndicator color={"#fff"} size="small" />
              ) : isOutOfStock ? (
                <Ionicons name="close" size={22} color={"#fff"} />
              ) : isProductInCart ? (
                <View className="flex-row items-center">
                  <Ionicons name="checkmark" size={20} color={"#fff"} />
                </View>
              ) : isMaxStockReached ? (
                <Ionicons name="alert" size={20} color={"#fff"} />
              ) : (
                <Ionicons name="add" size={22} color={"#000"} />
              )}
            </TouchableOpacity>
          </View>

          {/* Stock Status */}
          <View className="flex-row items-center mt-3">
            <View
              className={`w-2 h-2 rounded-full mr-2 ${
                product.stock > 0 ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <Text
              className={`text-xs font-medium ${
                product.stock > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {isMaxStockReached
                ? "Max stock reached"
                : product.stock > 0
                  ? `In Stock • ${product.stock} available`
                  : "Out of Stock"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Product;
