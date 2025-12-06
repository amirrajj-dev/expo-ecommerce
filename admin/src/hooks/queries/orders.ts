import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../helpers/api.helper";
import { queryConfig } from "../useQueryConfig";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => adminApi.getAllOrders(),
    ...queryConfig.realtime, // Orders update frequently
  });
};