import { useApi } from "@/libs/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Toast from "react-native-toast-message"
import type { ApiResponse } from "@/types/api/api.interface"
import type { Cart, CartItem } from "@/types/interfaces/cart.interface"
import { AxiosError } from "axios"

export const useDeleteFromCart = () => {
  const queryClient = useQueryClient()
  const api = useApi()
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.delete<ApiResponse<Cart>>(`/cart/${productId}`)
      return res.data
    },
    
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] })

      const previousCart = queryClient.getQueryData<ApiResponse<Cart>>(["cart"])

      queryClient.setQueryData<ApiResponse<Cart>>(
        ["cart"],
        (old) => {
          if (!old?.data) return old

          // Check if product exists in cart
          const itemExists = old.data.items?.some(
            (item: CartItem) => item.product?._id === productId
          )
          
          if (!itemExists) {
            Toast.show({
              type: 'info',
              text1: "Info",
              text2: "Item not found in cart"
            })
            throw new Error("Item not found in cart")
          }

          // Remove the item
          const updatedItems = old.data.items?.filter(
            (item: CartItem) => item.product?._id !== productId
          )

          return {
            ...old,
            data: {
              ...old.data,
              items: updatedItems,
            },
          }
        }
      )

      return { previousCart }
    },
    
    onSuccess: () => {      
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Item removed from cart"
      })
    },
    
    onError: (error: AxiosError<{message : string}>, _productId, context) => {
      if (!error.message.includes("not found") || !error?.response?.data?.message?.includes("not found")) {
        queryClient.setQueryData(["cart"], context?.previousCart)
      }

      if (error.message.includes("Network") || error.response?.data.message.includes('Network')) {
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "Please check your connection"
        })
      } else if (!error.message.includes("not found") || !error?.response?.data?.message?.includes("not found")) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error?.response?.data?.message || "Failed to remove item"
        })
      }
    },
    
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}