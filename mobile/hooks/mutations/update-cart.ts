import { useApi } from "@/libs/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Toast from "react-native-toast-message"
import type { ApiResponse } from "@/types/api/api.interface"
import type { Cart, CartItem } from "@/types/interfaces/cart.interface"
import { AxiosError } from "axios"

export const useUpdateCart = (productId: string) => {
  const queryClient = useQueryClient()
  const api = useApi()
  
  return useMutation({
    mutationFn: async (quantity: number) => {
      const res = await api.put<ApiResponse<Cart>>(`/cart/${productId}`, { quantity })
      return res.data
    },
    
    onMutate: async (quantity: number) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] })

      const previousCart = queryClient.getQueryData<ApiResponse<Cart>>(["cart"])

      // Check stock availability from product data (if available)
      const cartData = previousCart?.data
      const targetItem = cartData?.items?.find(
        (item: CartItem) => item.product?._id === productId
      )
      
      if (!targetItem) {
        Toast.show({
          type: 'error',
          text1: "Error",
          text2: "Item not found in cart"
        })
        throw new Error("Item not found in cart")
      }

      // Check stock limit if product data is available
      const product = targetItem.product as any
      if (product?.stock !== undefined && quantity > product.stock) {
        Toast.show({
          type: 'error',
          text1: "Error",
          text2: `Only ${product.stock} items available`
        })
        throw new Error(`Insufficient stock. Only ${product.stock} available.`)
      }

      queryClient.setQueryData<ApiResponse<Cart>>(
        ["cart"],
        (old) => {
          if (!old?.data?.items) return old

          // If quantity is 0 or less, remove the item
          if (quantity <= 0) {
            return {
              ...old,
              data: {
                ...old.data,
                items: old.data.items.filter(
                  (item: CartItem) => item.product?._id !== productId
                ),
              },
            }
          }

          // Update quantity
          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((item: CartItem) => {
                if (item.product?._id === productId) {
                  return { ...item, quantity }
                }
                return item
              }),
            },
          }
        }
      )

      return { previousCart, targetItem }
    },
    
    onSuccess: (response) => {
      console.log(JSON.stringify(response.data?.items));
      const updatedItem = response.data?.items?.find(
        (item: CartItem) => String(item.product) === productId
      )
      
      if (!updatedItem) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Item removed from cart"
        })
      } else {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: `Quantity updated to ${updatedItem.quantity}`
        })
      }
    },
    
    onError: (error: AxiosError<{message : string}>, _quantity, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart)

      if (error.message.includes("Insufficient stock") || error?.response?.data?.message?.includes("Insufficient stock")) {
        Toast.show({
          type: "error",
          text1: "Stock Limit",
          text2: error.message
        })
      } else if (error.message.includes("Network") || error?.response?.data?.message?.includes("Network")) {
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "Please check your connection"
        })
      } else if (!error.message.includes("not found") || !error?.response?.data?.message?.includes("not found")) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error?.response?.data?.message || "Failed to update cart"
        })
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}