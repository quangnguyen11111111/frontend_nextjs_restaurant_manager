import http from "@/lib/http";
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { get } from "http";

const accountApiRequest = {
  me: () => http.get<AccountResType>("/api/accounts/me"),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>("/api/accounts/me", body),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>("/api/accounts/change-password", body),

  list: () => http.get<AccountListResType>("/api/accounts"),
  addEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>("/api/accounts/", body),
  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType  ) =>
    http.put<AccountResType>(`/api/accounts/detail/${id}`, body),
  getEmployee: (id: number) =>
    http.get<AccountResType>(`/api/accounts/detail/${id}`),
  deleteEmployee: (id: number) =>
    http.delete<AccountResType>(`/api/accounts/detail/${id}`),
};
export default accountApiRequest;
