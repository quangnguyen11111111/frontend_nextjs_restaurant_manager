import authApiRequest from "@/apiRequest/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.cLogin,
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApiRequest.cLogout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
