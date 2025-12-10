import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../helpers/api.helper";
import type { Product } from "../../types/interfaces/product.interface";
import type { ApiResponse } from "../../types/api/api.interface";
import { toast } from "sonner";

export const useUpdateProduct = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => 
      adminApi.updateProduct(productId, formData),
    onMutate: async (formData) => {
      await queryClient.cancelQueries({ queryKey: ["products", productId] });
      await queryClient.cancelQueries({ queryKey: ["products"] });

      const previousProducts = queryClient.getQueryData<
        ApiResponse<Product[]>
      >(["products"]);

      const previousProduct = queryClient.getQueryData<
        ApiResponse<Product>
      >(["products", productId]);

      // Get updated fields from FormData with validation
      const updates: Partial<Product> = {};
      
      if (formData.has("name")) {
        const name = formData.get("name") as string;
        if (name) updates.name = name;
      }
      
      if (formData.has("description")) {
        const description = formData.get("description") as string;
        if (description) updates.description = description;
      }
      
      if (formData.has("price")) {
        const priceStr = formData.get("price") as string;
        const price = parseFloat(priceStr);
        if (!isNaN(price)) updates.price = price;
      }
      
      if (formData.has("stock")) {
        const stockStr = formData.get("stock") as string;
        const stock = parseInt(stockStr);
        if (!isNaN(stock)) updates.stock = stock;
      }
      
      if (formData.has("category")) {
        const category = formData.get("category") as string;
        if (category) updates.category = category;
      }

      // Only update if we have valid changes
      if (Object.keys(updates).length === 0) {
        throw new Error("No valid updates provided");
      }

      // Optimistically update product
      queryClient.setQueryData<ApiResponse<Product[]>>(
        ["products"],
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map(product =>
              product._id === productId
                ? { ...product, ...updates, updatedAt: new Date().toISOString() }
                : product
            ),
          };
        }
      );

      // Also update individual product query
      queryClient.setQueryData<ApiResponse<Product>>(
        ["products", productId],
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: { ...old.data, ...updates, updatedAt: new Date().toISOString() },
          };
        }
      );

      return { previousProducts, previousProduct };
    },
    onSuccess: (response) => {
      toast.success("Product updated successfully");
      
      // Update cache with server response
      queryClient.setQueryData<ApiResponse<Product[]>>(
        ["products"],
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map(product =>
              product._id === productId ? response.data! : product
            ),
          };
        }
      );

      queryClient.setQueryData<ApiResponse<Product>>(
        ["products", productId],
        () => response
      );
      
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: Error, _variables, context) => {
      // Revert optimistic updates
      queryClient.setQueryData(["products"], context?.previousProducts);
      queryClient.setQueryData(
        ["products", productId],
        context?.previousProduct
      );
      
      toast.error(error.message || "Failed to update product");
    },
  });
};