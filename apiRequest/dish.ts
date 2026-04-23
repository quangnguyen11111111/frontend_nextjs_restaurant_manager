import http from "@/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";
const dishApiRequest = {
  list: (page: number) => http.get<DishListResType>(`/api/dishes?page=${page}`),
  getDetail: (id: number) => http.get<DishResType>(`/api/dishes/${id}`),
  add: (body: CreateDishBodyType) =>
    http.post<DishResType>(`/api/dishes`, body),
  update: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`/api/dishes/${id}`, body),
  delete: (id: number) => http.delete<DishResType>(`/api/dishes/${id}`),
};
export default dishApiRequest;
