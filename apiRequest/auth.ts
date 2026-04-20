import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,
  sLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body),
  cLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  sLogout: (body: LogoutBodyType) =>
    http.post("/api/auth/logout", { refreshToken: body.refreshToken }),
  cLogout: () =>
    http.post("/api/auth/logout", null, {
      baseUrl: "",
    }),
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/api/auth/refresh-token", body),
  async cRefreshToken() {
    if (this.refreshTokenRequest) return this.refreshTokenRequest;
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/auth/refresh-token",
      null,
      {
        baseUrl: "",
      },
    );
    try {
      return await this.refreshTokenRequest;
    } finally {
      this.refreshTokenRequest = null;
    }
  },
};
export default authApiRequest;
