import { useQuery } from "@tanstack/react-query";
import { queryConfig } from "../useQueryConfig";
import { useApi } from "@/libs/axios";
import { ApiResponse } from "@/types/api/api.interface";
import { Cart } from "@/types/interfaces/cart.interface";

export const useCart = () => {
  const api = useApi();

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Cart>>("/cart");
      return response.data;
    },
    ...queryConfig.realtime,
  });
};