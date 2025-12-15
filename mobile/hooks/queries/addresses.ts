import { useQuery } from "@tanstack/react-query"
import { useApi } from "@/libs/axios"
import { ApiResponse } from "@/types/api/api.interface"
import type { Address } from "@/types/interfaces/user.interface"
import { queryConfig } from "../useQueryConfig"

export const useAddresses = () => {
  const api = useApi()
  
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Address[]>>("/users/addresses")
      return response.data
    },
    ...queryConfig.infrequent
  })
}