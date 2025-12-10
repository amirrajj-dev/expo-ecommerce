import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../helpers/api.helper";
import { queryConfig } from "../useQueryConfig";
import type { Product } from "../../types/interfaces/product.interface";
import type { ApiResponse } from "../../types/api/api.interface";

export const useProduct = (productId: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["products", productId],
    queryFn: async () => {
        // first try to read from cache
      const cachedProducts = queryClient.getQueryData<ApiResponse<Product[]>>([
        "admin",
        "products",
      ]);
      
      if (cachedProducts?.data) {
        const product = cachedProducts.data.find(p => p._id === productId);
        if (product) {
          return {
            success: true,
            message: "Product fetched from cache",
            data: product,
            statusCode: 200,
            timestamp: new Date().toISOString(),
            path: `/admin/products/${productId}`,
          } as ApiResponse<Product>;
        }
      }
      
      // Fallback to API call if not in cache
      const response = await adminApi.getAllProducts();
      const product = response.data?.find(p => p._id === productId);
      
      if (!product) {
        throw new Error("Product not found");
      }
      
      return {
        ...response,
        data: product,
      };
    },
    enabled: !!productId,
    ...queryConfig.default,
  });
};