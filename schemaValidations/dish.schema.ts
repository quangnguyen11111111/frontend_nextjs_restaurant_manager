import { DishStatusValues } from "@/constants/type";
import z from "zod";

export const CreateDishBody = z.object({
  name: z.string().min(1).max(256),
  // giới hạn giá cả tối đa là 10 triệu để tránh lỗi tràn số
  price: z.number().positive().max(10000000),
  description: z.string().max(10000),
  image: z.string().url(),
  status: z.enum(DishStatusValues).optional(),
  imageS3Key: z.string().optional(),
});

export type CreateDishBodyType = z.TypeOf<typeof CreateDishBody>;

export const DishSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number().positive(),
  description: z.string(),
  image: z.string().url(),
  status: z.enum(DishStatusValues),
  createdAt: z.date(),
  updatedAt: z.date(),
  imageS3Key: z.string().optional(),
});
const paginationMeta = z.object({
  page: z.number(),
  perPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
export const DishRes = z.object({
  data: DishSchema,
  message: z.string(),
});

export type DishResType = z.TypeOf<typeof DishRes>;

export const DishListRes = z.object({
  data: z.array(DishSchema),
  message: z.string(),
  pagination: paginationMeta,
});

export type DishListResType = z.TypeOf<typeof DishListRes>;

export const UpdateDishBody = CreateDishBody;
export type UpdateDishBodyType = CreateDishBodyType;
export const DishParams = z.object({
  id: z.coerce.number(),
});
export type DishParamsType = z.TypeOf<typeof DishParams>;
