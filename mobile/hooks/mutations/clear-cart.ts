import { useApi } from "@/libs/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Toast from "react-native-toast-message"
import type { ApiResponse } from "@/types/api/api.interface"
import type { Cart } from "@/types/interfaces/cart.interface"
import { AxiosError } from "axios"

export const useClearCart = () => {
  const queryClient = useQueryClient()
  const api = useApi()
  
  return useMutation({
    mutationFn: async () => {
      const res = await api.delete<ApiResponse<Cart>>("/cart")
      return res.data
    },
    
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] })

      const previousCart = queryClient.getQueryData<ApiResponse<Cart>>(["cart"])

      // Check if cart is already empty
      const isEmpty = previousCart?.data?.items?.length === 0
      if (isEmpty) {
        Toast.show({
          type: 'info',
          text1: "Info",
          text2: "Cart is already empty"
        })
        throw new Error("Cart is already empty")
      }

      queryClient.setQueryData<ApiResponse<Cart>>(
        ["cart"],
        (old) => {
          if (!old?.data) return old

          return {
            ...old,
            data: {
              ...old.data,
              items: [],
            },
          }
        }
      )

      return { previousCart }
    },
    
    onSuccess: (response) => {      
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Cart cleared successfully"
      })
    },
    
    onError: (error: AxiosError<{message : string}>, _variables, context) => {
      if (!error.message.includes("already empty") || !error?.response?.data?.message?.includes("already empty")) {
        queryClient.setQueryData(["cart"], context?.previousCart)
      }

      if (error.message.includes("Network") || error?.response?.data?.message?.includes("Network")) {
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "Please check your connection"
        })
      } else if (!error.message.includes("already empty") || !error?.response?.data?.message?.includes("already empty")) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error?.response?.data?.message || "Failed to clear cart"
        })
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}