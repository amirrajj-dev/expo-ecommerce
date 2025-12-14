import { useQuery } from "@tanstack/react-query";
import { queryConfig } from "../useQueryConfig";
import { useApi } from "@/libs/axios";
import { ApiResponse } from "@/types/api/api.interface";
import { Product } from "@/types/interfaces/product.interface";

export const useWishlist = () => {
  const api = useApi();

  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product[]>>("/users/wishlist");
      return response.data;
    },
    ...queryConfig.realtime,
  });
};
