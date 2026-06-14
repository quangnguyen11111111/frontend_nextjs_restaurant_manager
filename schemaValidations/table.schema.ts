import { TableStatusValues } from "@/constants/type";
import z from "zod";

export const CreateTableBody = z.object({
  number: z.number().positive(),
  capacity: z.number().positive(),
  max_capacity: z.number().positive().optional(),
  group_id: z.string().optional(),
  group_order: z.number().positive().optional(),
  status: z.enum(TableStatusValues).optional(),
});

export type CreateTableBodyType = z.TypeOf<typeof CreateTableBody>;

export const TableSchema = z.object({
  number: z.number(),
  capacity: z.number(),
  max_capacity: z.number().optional().nullable(),
  group_id: z.string().optional().nullable(),
  group_order: z.number().optional().nullable(),
  status: z.enum(TableStatusValues),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TableRes = z.object({
  data: TableSchema,
  message: z.string(),
});

export type TableResType = z.TypeOf<typeof TableRes>;

export const TableListRes = z.object({
  data: z.array(TableSchema),
  message: z.string(),
});

export type TableListResType = z.TypeOf<typeof TableListRes>;

export const UpdateTableBody = z.object({
  changeToken: z.boolean(),
  capacity: z.number().positive(),
  max_capacity: z.number().positive().optional().nullable(),
  group_id: z.string().optional().nullable(),
  group_order: z.number().positive().optional().nullable(),
  status: z.enum(TableStatusValues).optional(),
});
export type UpdateTableBodyType = z.TypeOf<typeof UpdateTableBody>;
export const TableParams = z.object({
  number: z.number(),
});
export type TableParamsType = z.TypeOf<typeof TableParams>;
