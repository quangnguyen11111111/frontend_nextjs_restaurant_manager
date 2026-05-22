import http from "@/lib/http";
import { OrderSchema } from "@/schemaValidations/order.schema";
import z from "zod";

export const HostOpenBody = z.object({
  table_number: z.number(),
  guest_count: z.number().optional(),
});
export type HostOpenBodyType = z.TypeOf<typeof HostOpenBody>;

export const GuestJoinBody = z.object({
  table_number: z.number(),
  session_pin: z.string(),
});
export type GuestJoinBodyType = z.TypeOf<typeof GuestJoinBody>;

export const SessionRes = z.object({
  message: z.string(),
  data: OrderSchema,
});
export type SessionResType = z.TypeOf<typeof SessionRes>;

const sessionsApiRequest = {
  hostOpen: (body: HostOpenBodyType) =>
    http.post<SessionResType>("/api/sessions/host-open", body),
  guestJoin: (body: GuestJoinBodyType) =>
    http.post<SessionResType>("/api/sessions/guest-join", body),
};

export default sessionsApiRequest;
