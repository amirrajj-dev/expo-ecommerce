import { useApi } from "@/libs/axios"
import { AddAddressDto } from "@/types/dtos/add-address.dto"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Toast from "react-native-toast-message"
import type { ApiResponse } from "@/types/api/api.interface"
import type { Address } from "@/types/interfaces/user.interface"
import { AxiosError } from "axios"

export const useAddAddress = () => {
  const queryClient = useQueryClient()
  const api = useApi()
  
  return useMutation({
    mutationFn: async (address: AddAddressDto) => {
      const res = await api.post<ApiResponse<{ address: Address }>>('/users/addresses', address)
      return res.data
    },
    
    onMutate: async (newAddress: AddAddressDto) => {
      await queryClient.cancelQueries({ queryKey: ["addresses"] })
      const previousAddresses = queryClient.getQueryData<ApiResponse<Address[]>>(["addresses"])

      const tempId = `temp-${Date.now()}`
      const shouldBeDefault = newAddress.isDefault ?? previousAddresses?.data?.length === 0
      
      const tempAddress: Address = {
        _id: tempId,
        label: newAddress.label,
        fullName: newAddress.fullName,
        streetAddress: newAddress.streetAddress,
        city: newAddress.city,
        state: newAddress.state,
        zipCode: newAddress.zipCode,
        phoneNumber: newAddress.phoneNumber,
        isDefault: shouldBeDefault,
      }

      queryClient.setQueryData<ApiResponse<Address[]>>(
        ["addresses"],
        (old) => {
          if (!old?.data) {
            return {
              success: true,
              message: "Addresses fetched successfully",
              data: [tempAddress],
              statusCode: 200,
              timestamp: new Date().toISOString(),
              path: "/users/addresses",
            }
          }

          // If new address is default, update existing default addresses
          let updatedAddresses = [...old.data]
          if (shouldBeDefault) {
            updatedAddresses = updatedAddresses.map(addr => ({
              ...addr,
              isDefault: false
            }))
          }

          return {
            ...old,
            data: [...updatedAddresses, tempAddress],
          }
        }
      )

      return { previousAddresses, tempId }
    },
    
    onSuccess: (response, newAddress, context) => {
      queryClient.setQueryData<ApiResponse<Address[]>>(
        ["addresses"],
        (old) => {
          if (!old?.data) {
            return {
              success: true,
              message: "Addresses fetched successfully",
              data: response.data?.address ? [response.data.address] : [],
              statusCode: response.statusCode,
              timestamp: response.timestamp,
              path: response.path,
            }
          }

          return {
            ...old,
            data: old.data.map(addr =>
              addr._id === context?.tempId ? response.data!.address : addr
            ),
          }
        }
      )

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Address added successfully"
      })
    },
    
    onError: (error: AxiosError<{message : string}>, _variables, context) => {
      queryClient.setQueryData(["addresses"], context?.previousAddresses)
      if (error.message.includes("Network") || error?.response?.data?.message.includes("Network")) {
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "Please check your connection and try again"
        })
      }else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error?.response?.data?.message || "Failed to add address"
        })
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] })
    },
  })
}