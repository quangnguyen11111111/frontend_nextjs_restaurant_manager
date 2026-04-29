import http from "@/lib/http";
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";

const tableApiRequest = {
  list: () => http.get<TableListResType>(`/api/tables`),
  getDetail: (id: number) => http.get<TableResType>(`/api/tables/${id}`),
  add: (body: CreateTableBodyType) =>
    http.post<TableResType>(`/api/tables`, body),
  update: (id: number, body: UpdateTableBodyType) =>
    http.put<TableResType>(`/api/tables/${id}`, body),
  delete: (id: number) => http.delete<TableResType>(`/api/tables/${id}`),
};
export default tableApiRequest;
