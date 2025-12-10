import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../helpers/api.helper";
import type { Product } from "../../types/interfaces/product.interface";
import type { ApiResponse } from "../../types/api/api.interface";
import { toast } from "sonner";

interface UseDeleteProductOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDeleteProduct = (options?: UseDeleteProductOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => adminApi.deleteProduct(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      
      const previousProducts = queryClient.getQueryData<
        ApiResponse<Product[]>
      >(["products"]);

      // Optimistically remove product
      queryClient.setQueryData<ApiResponse<Product[]>>(
        ["products"],
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter(product => product._id !== productId),
          };
        }
      );

      return { previousProducts };
    },
    onSuccess: (_, productId) => {
      toast.success("Product deleted successfully");
      
      // Remove product from cache
      queryClient.removeQueries({ queryKey: ["products", productId] });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      options?.onSuccess?.();
    },
    onError: (error: Error, _productId, context) => {
      // Revert optimistic update
      queryClient.setQueryData(["products"], context?.previousProducts);
      
      toast.error(error.message || "Failed to delete product");
      options?.onError?.(error)
    },
  });
};