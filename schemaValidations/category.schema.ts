import { CategoryStatusValues } from "@/constants/type";
import z from "zod";

export const CategoryFlatSchema = z.object({
  id: z.number(),
  name: z.string(),
  parent_id: z.number().nullable(),
  status: z.enum(CategoryStatusValues).nullable().optional(),
  order: z.number().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CategoryTreeSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(CategoryStatusValues).nullable().optional(),
  children: z.array(z.lazy(() => CategoryTreeSchema)).optional(),
});

const paginationMeta = z.object({
  page: z.number(),
  perPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const CategoryListRes = z.object({
  data: z.array(CategoryFlatSchema),
  message: z.string(),
  pagination: paginationMeta,
});

export const CategoryRes = z.object({
  data: CategoryFlatSchema,
  message: z.string(),
});

export const CategoryTreeRes = z.object({
  data: z.array(CategoryTreeSchema),
  message: z.string(),
});

export const CreateCategoryBody = z.object({
  name: z.string().min(1).max(256),
  parent_id: z.number().int().positive().nullable().optional(),
  status: z.enum(CategoryStatusValues).optional(),
  order: z.number().int().min(0).optional(),
});

export type CreateCategoryBodyType = z.TypeOf<typeof CreateCategoryBody>;
export type CategoryListResType = z.TypeOf<typeof CategoryListRes>;
export type CategoryResType = z.TypeOf<typeof CategoryRes>;
export type CategoryTreeResType = z.TypeOf<typeof CategoryTreeRes>;

export const UpdateCategoryBody = CreateCategoryBody;
export type UpdateCategoryBodyType = z.TypeOf<typeof UpdateCategoryBody>;
