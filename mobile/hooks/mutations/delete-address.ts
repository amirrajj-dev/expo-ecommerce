import { useApi } from "@/libs/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Toast from "react-native-toast-message"
import type { ApiResponse } from "@/types/api/api.interface"
import { Address } from "@/types/interfaces/user.interface"
import { AxiosError } from "axios"

export const useDeleteAddress = () => {
  const queryClient = useQueryClient()
  const api = useApi()
  
  return useMutation({
    mutationFn: async (addressId: string) => {
      const res = await api.delete<ApiResponse<{ defaultReassigned: boolean }>>(
        `/users/addresses/${addressId}`
      )
      return res.data
    },
    
    onMutate: async (addressId: string) => {
      await queryClient.cancelQueries({ queryKey: ["addresses"] })

      const previousAddresses = queryClient.getQueryData<ApiResponse<Address[]>>(["addresses"])

      // Check if deleting default address
      const deletingDefault = previousAddresses?.data?.find(addr => addr._id === addressId)?.isDefault
      
      queryClient.setQueryData<ApiResponse<Address[]>>(
        ["addresses"],
        (old) => {
          if (!old?.data) return old

          const updatedAddresses = old.data.filter(addr => addr._id !== addressId)
          
          // If deleting default and there are remaining addresses, set first as default
          if (deletingDefault && updatedAddresses.length > 0) {
            updatedAddresses[0]!.isDefault = true
          }

          return {
            ...old,
            data: updatedAddresses,
          }
        }
      )

      return { previousAddresses, deletingDefault }
    },
    
    onSuccess: (response, addressId, context) => {
      console.log(response);
      console.log("yes");
      console.log(context);
      if (context?.deletingDefault && response.data?.defaultReassigned) {
        Toast.show({
          type: "info",
          text1: "Info",
          text2: "Default address reassigned"
        })
      } else {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Address deleted successfully"
        })
      }
    },
    
    onError: (error: AxiosError<{message : string}>, _variables, context) => {
      queryClient.setQueryData(["addresses"], context?.previousAddresses)

      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || error.message || "Failed to delete address"
      })
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] })
    },
  })
}