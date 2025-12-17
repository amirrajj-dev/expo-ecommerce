import { useApi } from "@/libs/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { ApiResponse } from "@/types/api/api.interface";
import { Cart } from "@/types/interfaces/cart.interface";
import { AxiosError } from "axios";

export const useAddToCart = () => {
  const api = useApi();
  const queryClient = useQueryClient(); 
  
  return useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      const res = await api.post<ApiResponse<Cart>>('/cart', { productId, quantity });
      return res.data;
    },
    onMutate: async ({ productId, quantity = 1 }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<ApiResponse<Cart>>(["cart"]);

      // Optimistic update
      queryClient.setQueryData<ApiResponse<Cart>>(["cart"], (old) => {
        if (!old?.data) {
          return old;
        }

        const existingItemIndex = old.data.items.findIndex(
          (item) => item.product._id === productId
        );

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          const updatedItems = [...old.data.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
          };

          return {
            ...old,
            data: {
              ...old.data,
              items: updatedItems,
            },
          };
        } else {
          return old;
        }
      });

      return { previousCart };
    },
    onSuccess: (response) => {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Product added to cart",
      });
    },
    onError: (error: AxiosError<{message : string}>, _, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
      
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message.includes("stock") || error?.response?.data?.message.includes("stock") 
          ? "Insufficient stock" 
          : error?.response?.data?.message || "Failed to add to cart",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};