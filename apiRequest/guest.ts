import http from "@/lib/http";
import {
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import {
  GuestCreateOrdersBodyType,
  GuestCreateOrdersResType,
  GuestGetOrdersResType,
  GuestLoginBodyType,
  GuestLoginResType,
} from "@/schemaValidations/guest.schema";

const guestApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,
  sLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/api/guests/auth/login", body),
  login: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/api/guest/auth/login", body, {
      baseUrl: "",
    }),
  sRecover: (body: { customer_phone: string; session_pin: string }) =>
    http.post<any>("/api/guests/auth/recover", body),
  recover: (body: { customer_phone: string; session_pin: string }) =>
    http.post<any>("/api/guest/auth/recover", body, { baseUrl: "" }),
  sLogout: (
    body: LogoutBodyType & {
      accessToken: string;
    },
  ) =>
    http.post(
      "/api/guests/auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      },
    ),
  logout: () => http.post("/api/guest/auth/logout", null, { baseUrl: "" }), // client gọi đến route handler, không cần truyền AT và RT vào body vì AT và RT tự  động gửi thông qua cookie rồi
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/api/guests/auth/refresh-token", body),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/guests/auth/refresh-token",
      null,
      {
        baseUrl: "",
      },
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  },
  order: (body: GuestCreateOrdersBodyType) =>
    http.post<GuestCreateOrdersResType>("/api/guests/orders", body),
  getOrderList: () => http.get<GuestGetOrdersResType>("/api/guests/orders"),
  cancelOrder: () => http.post<any>("/api/guests/orders/cancel", null),
  cancelOrderDetail: (orderDetailId: number) => http.put<any>(`/api/guests/orders/${orderDetailId}/cancel`, null),
};

export default guestApiRequest;
