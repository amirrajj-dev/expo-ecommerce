import { useQuery } from "@tanstack/react-query";
import { queryConfig } from "../useQueryConfig";
import { useApi } from "@/libs/axios";
import { ApiResponse } from "@/types/api/api.interface";
import { Product } from "@/types/interfaces/product.interface";

export const useProducts = () => {
  const api = useApi();
  return useQuery({
    queryKey: ["products"],
    queryFn: async () =>
      await api
        .get<ApiResponse<Product[]>>("/products")
        .then((res) => res.data),
    ...queryConfig.realtime,
  });
};
