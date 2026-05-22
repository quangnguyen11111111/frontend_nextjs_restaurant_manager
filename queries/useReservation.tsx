import reservationsApiRequest from "@/apiRequest/reservations";
import { useMutation } from "@tanstack/react-query";

export const useCreateReservationMutation = () => {
  return useMutation({
    mutationFn: reservationsApiRequest.createReservation,
  });
};

export const useCheckInReservationMutation = () => {
  return useMutation({
    mutationFn: ({ orderId, table_number }: { orderId: number, table_number: number }) =>
      reservationsApiRequest.checkInReservation(orderId, { table_number }),
  });
};
