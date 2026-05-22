import http from "@/lib/http";
import z from "zod";

export const CheckCapacityQuery = z.object({
  guest_count: z.number(),
  target_time: z.string(), // ISO datetime string
});
export type CheckCapacityQueryType = z.TypeOf<typeof CheckCapacityQuery>;

export const CheckCapacityRes = z.object({
  message: z.string(),
  data: z.object({
    target_time: z.string(),
    guest_count: z.number(),
    available_tables: z.array(
      z.object({
        number: z.number(),
        capacity: z.number(),
        status: z.string(),
      })
    ),
    available_count: z.number(),
  }),
});
export type CheckCapacityResType = z.TypeOf<typeof CheckCapacityRes>;

const capacityApiRequest = {
  checkCapacity: (query: CheckCapacityQueryType) =>
    http.get<CheckCapacityResType>(`/api/capacity/check?guest_count=${query.guest_count}&target_time=${query.target_time}`),
};

export default capacityApiRequest;
