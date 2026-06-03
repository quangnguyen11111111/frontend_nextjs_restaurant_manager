import http from "@/lib/http";
import { OrderSchema } from "@/schemaValidations/order.schema";
import z from "zod";

export const CreateReservationBody = z.object({
  guest_count: z.number().min(1),
  reservation_time: z.string(), // ISO date
  customer_name: z.string(),
  customer_phone: z.string(),
});
export type CreateReservationBodyType = z.TypeOf<typeof CreateReservationBody>;

export const CheckInReservationBody = z.object({
  table_number: z.number(),
});
export type CheckInReservationBodyType = z.TypeOf<typeof CheckInReservationBody>;

export const ReservationRes = z.object({
  message: z.string(),
  data: OrderSchema,
});
export type ReservationResType = z.TypeOf<typeof ReservationRes>;

const reservationsApiRequest = {
  sCreateReservation: (body: CreateReservationBodyType) =>
    http.post<ReservationResType>("/api/reservations", body),
  createReservation: (body: CreateReservationBodyType) =>
    http.post<ReservationResType>("/api/guest/auth/reservation", body, {
      baseUrl: "",
    }),
  checkInReservation: (orderId: number, body: CheckInReservationBodyType) =>
    http.post<ReservationResType>(`/api/reservations/${orderId}/check-in`, body),
};

export default reservationsApiRequest;
