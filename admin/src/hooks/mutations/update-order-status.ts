import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../helpers/api.helper";
import type { Order, OrderStatus } from "../../types/interfaces/order.interface";
import type { ApiResponse } from "../../types/api/api.interface";
import { toast } from "sonner";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      adminApi.updateOrderStatus(orderId, { status }),
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      await queryClient.cancelQueries({ queryKey: ["orders", orderId] });

      const previousOrders = queryClient.getQueryData<ApiResponse<Order[]>>(["orders"]);
      const previousOrder = queryClient.getQueryData<ApiResponse<Order>>(["orders", orderId]);

      const now = new Date().toISOString();
      const updates: Partial<Order> = { status, updatedAt: now };

      if (status === "shipped") updates.shippedAt = now;
      if (status === "delivered") updates.deliveredAt = now;

      // Optimistic update (list)
      queryClient.setQueryData<ApiResponse<Order[]>>(["orders"], old => {
        if (!old?.data) return old;
        return { ...old, data: old.data.map(o => o._id === orderId ? { ...o, ...updates } : o) };
      });

      // Optimistic update (one order)
      queryClient.setQueryData<ApiResponse<Order>>(["orders", orderId], old => {
        if (!old?.data) return old;
        return { ...old, data: { ...old.data, ...updates } };
      });

      return { previousOrders, previousOrder };
    },
    onSuccess: (response, { orderId }) => {
      toast.success(`Order updated to ${response.data?.status}`);

      queryClient.setQueryData<ApiResponse<Order[]>>(["orders"], old => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map(o => o._id === orderId ? response.data! : o),
        };
      });

      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (_error, { orderId }, context) => {
      queryClient.setQueryData(["orders"], context?.previousOrders);
      queryClient.setQueryData(["orders", orderId], context?.previousOrder);

      toast.error("Failed to update order");
    },
  });
};
