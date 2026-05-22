import sessionsApiRequest from "@/apiRequest/sessions";
import { useMutation } from "@tanstack/react-query";

export const useHostOpenMutation = () => {
  return useMutation({
    mutationFn: sessionsApiRequest.hostOpen,
  });
};

export const useGuestJoinMutation = () => {
  return useMutation({
    mutationFn: sessionsApiRequest.guestJoin,
  });
};
