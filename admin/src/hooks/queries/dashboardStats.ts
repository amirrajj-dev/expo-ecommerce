import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../helpers/api.helper";
import { queryConfig } from "../useQueryConfig";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => adminApi.getDashboardStats(),
    ...queryConfig.default,
  });
};