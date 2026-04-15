import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  sLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body),
  cLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  sLogout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post("/api/auth/logout", {refreshToken: body.refreshToken}, {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
      },
    }),
  cLogout: () =>
    http.post("/api/auth/logout", null, {
      baseUrl: "",
    }),
};
export default authApiRequest;
