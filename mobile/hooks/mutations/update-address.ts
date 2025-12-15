import { useApi } from "@/libs/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import type { ApiResponse } from "@/types/api/api.interface";
import type { Address } from "@/types/interfaces/user.interface";
import { AxiosError } from "axios";
import { AddAddressDto } from "@/types/dtos/add-address.dto";

export const useUpdateAddress = (addressId: string) => {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (address: Partial<AddAddressDto>) => {
      const res = await api.put<ApiResponse<{ address: Address }>>(
        `/users/addresses/${addressId}`,
        address
      );
      return res.data;
    },

    onMutate: async (updatedAddress: Partial<AddAddressDto>) => {
      await queryClient.cancelQueries({ queryKey: ["addresses"] });

      const previousAddresses = queryClient.getQueryData<
        ApiResponse<Address[]>
      >(["addresses"]);

      queryClient.setQueryData<ApiResponse<Address[]>>(["addresses"], (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((addr) => {
            if (addr._id === addressId) {
              const updated = { ...addr, ...updatedAddress };

              // If setting as default, update all other addresses
              if (updatedAddress.isDefault === true) {
                return {
                  ...updated,
                  isDefault: true,
                };
              }
              return updated;
            }

            // If another address is being set as default, remove default from this one
            if (updatedAddress.isDefault === true) {
              return { ...addr, isDefault: false };
            }

            return addr;
          }),
        };
      });

      return { previousAddresses };
    },

    onSuccess: (response) => {
      queryClient.setQueryData<ApiResponse<Address[]>>(["addresses"], (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((addr) =>
            addr._id === addressId ? response.data!.address : addr
          ),
        };
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Address updated successfully",
      });
    },

    onError: (error: AxiosError<{ message: string }>, _variables, context) => {
      queryClient.setQueryData(["addresses"], context?.previousAddresses);

      if (
        error.message.includes("cannot unset the default") ||
        error?.response?.data?.message?.includes("cannot unset the default")
      ) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Cannot unset default without selecting another default",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            error?.response?.data?.message ||
            error.message ||
            "Failed to update address",
        });
      }
    },
  });
};
