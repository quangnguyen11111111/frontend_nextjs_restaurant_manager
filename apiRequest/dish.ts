import http from "@/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";
const dishApiRequest = {
  listForAdmin: (page: number) =>
    http.get<DishListResType>(`/api/admin/dishes?page=${page}`),
  listByCategory: (categoryId: number, page: number) =>
    http.get<DishListResType>(
      `/api/dishes?category_id=${categoryId}&page=${page}`,
    ),
  getDetail: (id: number) => http.get<DishResType>(`/api/dishes/${id}`),
  add: (body: CreateDishBodyType) =>
    http.post<DishResType>(`/api/admin/dishes`, body),
  update: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`/api/admin/dishes/${id}`, body),
  delete: (id: number) => http.delete<DishResType>(`/api/admin/dishes/${id}`),
};
export default dishApiRequest;
