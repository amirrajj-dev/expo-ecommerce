import { useApi } from "@/libs/axios";
import { ApiResponse } from "@/types/api/api.interface";
import { Product } from "@/types/interfaces/product.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

interface WishlistResponse {
  wishlist: string[];
}

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.post<ApiResponse<WishlistResponse>>("/users/wishlist", {
        productId,
      });
      return res.data;
    },
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previousWishlist = queryClient.getQueryData<ApiResponse<Product[]>>([
        "wishlist",
      ]);

      queryClient.setQueryData<ApiResponse<Product[]>>(["wishlist"], (old) => {
        if (!old?.data) {
          return old;
        }

        // Prevent duplicates
        const productExists = old.data.some((product) => product._id === productId);
        
        if (productExists) {
          Toast.show({
            type: "info",
            text1: "Info",
            text2: "Product already exists in Wishlist",
          });
          throw new Error("Product already in wishlist");
        }

        return old;
      });

      return { previousWishlist };
    },
    onSuccess: (response) => {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Product added to wishlist",
      });
    },
    onError: (error: Error, _, context) => {
      if (!error.message.includes("already exists")) {
        queryClient.setQueryData(["wishlist"], context?.previousWishlist);
      }
      if (error.message.includes("Network")) {
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "please try again",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to add to wishlist",
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};