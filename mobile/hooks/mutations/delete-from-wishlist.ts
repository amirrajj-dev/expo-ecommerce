import { useApi } from "@/libs/axios";
import { ApiResponse } from "@/types/api/api.interface";
import { Product } from "@/types/interfaces/product.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

interface WishlistResponse {
  wishlist: Product[];
}

export const useDeleteFromWishlist = () => {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.delete<ApiResponse<WishlistResponse>>(
        `/users/wishlist/${productId}`
      );
      return res.data;
    },
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previousWishlist = queryClient.getQueryData<ApiResponse<Product[]>>(
        ["wishlist"]
      );

      queryClient.setQueryData<ApiResponse<Product[]>>(["wishlist"], (old) => {
        if (!old?.data) return old;

        const productExists = old.data.some(
          (product) => product._id === productId
        );

        if (!productExists) {
          Toast.show({
            type: "info",
            text1: "Info",
            text2: "Product not found in wishlist",
          });
          throw new Error("Product not found in wishlist");
        }

        return {
          ...old,
          data: old.data.filter((product) => product._id !== productId),
        };
      });

      return { previousWishlist, productId };
    },
    onSuccess: (response) => {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Product removed from wishlist",
      });
    },
    onError: (error: Error, productId, context) => {
      if (!error.message.includes("not found")) {
        queryClient.setQueryData(["wishlist"], context?.previousWishlist);
      }
      if (error.message.includes("Network")) {
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "Please check your connection and try again",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Failed to remove from wishlist",
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
