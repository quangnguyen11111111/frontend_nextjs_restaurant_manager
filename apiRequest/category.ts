import http from "@/lib/http";
import { MessageResType } from "@/schemaValidations/common.schema";
import {
  CategoryListResType,
  CategoryResType,
  CategoryTreeResType,
  CreateCategoryBodyType,
  UpdateCategoryBodyType,
} from "@/schemaValidations/category.schema";

const categoryApiRequest = {
  listAdmin: (page: number) =>
    http.get<CategoryListResType>(`/api/admin/categories?page=${page}`),
  listTree: () => http.get<CategoryTreeResType>("/api/categories"),
  getDetail: (id: number) => http.get<CategoryResType>(`/api/categories/${id}`),
  add: (body: CreateCategoryBodyType) =>
    http.post<CategoryResType>("/api/admin/categories", body),
  update: (id: number, body: UpdateCategoryBodyType) =>
    http.put<CategoryResType>(`/api/admin/categories/${id}`, body),
  delete: (id: number) =>
    http.delete<MessageResType>(`/api/admin/categories/${id}`),
};

export default categoryApiRequest;
