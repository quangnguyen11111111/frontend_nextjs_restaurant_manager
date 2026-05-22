import capacityApiRequest, { CheckCapacityQueryType } from "@/apiRequest/capacity";
import { useQuery } from "@tanstack/react-query";

export const useCheckCapacityQuery = (query: CheckCapacityQueryType, enabled: boolean) => {
  return useQuery({
    queryKey: ["capacity", query],
    queryFn: () => capacityApiRequest.checkCapacity(query),
    enabled,
  });
};
