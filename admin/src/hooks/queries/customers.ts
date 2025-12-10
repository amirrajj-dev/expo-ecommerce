import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../helpers/api.helper";
import { queryConfig } from "../useQueryConfig";

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => adminApi.getAllCustomers(),
    ...queryConfig.infrequent,
  });
};