import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../helpers/api.helper";
import { queryConfig } from "../useQueryConfig";

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const response = await adminApi.getAllOrders();
      const order = response.data?.find(o => o._id === orderId);
      
      if (!order) {
        throw new Error("Order not found");
      }
      
      return {
        ...response,
        data: order,
      };
    },
    enabled: !!orderId,
    ...queryConfig.default,
  });
};