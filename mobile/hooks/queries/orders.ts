import { useQuery } from "@tanstack/react-query";
import { queryConfig } from "../useQueryConfig";
import { useApi } from "@/libs/axios";
import { ApiResponse } from "@/types/api/api.interface";
import { Order } from "@/types/interfaces/order.interface";

export const useOrders = () => {
  const api = useApi();

  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Order[]>>("/orders");
      return response.data;
    },
    ...queryConfig.default,
  });
};