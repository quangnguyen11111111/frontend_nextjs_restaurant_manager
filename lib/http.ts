import authApiRequest from "@/apiRequest/auth";
import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import {
  LoginResType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";
import { toast } from "sonner";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({
    status,
    payload,
    message = "Http Error",
  }: {
    status: number;
    payload: any;
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: typeof ENTITY_ERROR_STATUS;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload, message: "Entity Error" });
    this.status = status;
    this.payload = payload;
  }
}

export const isClient = typeof window !== "undefined";
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined,
  isRetryAfterRefresh = false,
) => {
  const normalizedUrl = normalizePath(url);
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isClient) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = `${baseUrl}/${normalizePath(url)}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };
  // Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        },
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      const errorCode = (payload as any)?.code;

      const shouldTryRefreshToken =
        isClient &&
        errorCode === "TOKEN_EXPIRED" &&
        !isRetryAfterRefresh &&
        ![
          "api/auth/login",
          "api/auth/logout",
          "api/auth/refresh-token",
        ].includes(normalizedUrl);

      if (shouldTryRefreshToken) {
        try {
          const refreshRes = await authApiRequest.cRefreshToken();
          const refreshData = (refreshRes.payload as any)?.data;
          if (!refreshData?.accessToken || !refreshData?.refreshToken) {
            throw new Error("Refresh token request failed");
          }
          localStorage.setItem("accessToken", refreshData.accessToken);
          localStorage.setItem("refreshToken", refreshData.refreshToken);

          return request<Response>(method, url, options, true);
        } catch (error) {
          // Fall through to current unauthorized handling.
        }
      }

      const baseLogoutRequest = async () => {
        await authApiRequest.cLogout();
        toast.error("Gọi API thất bại, vui lòng đăng nhập lại");
      };
      if (isClient) {
        await baseLogoutRequest();
        location.href = "/login";
      } else {
        await baseLogoutRequest();
        redirect("/login");
      }
    } else {
      throw new HttpError(data);
    }
  }
  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (isClient) {
    if (normalizedUrl === "api/auth/login") {
      const { accessToken, refreshToken } = (payload as LoginResType).data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } else if (normalizedUrl === "api/auth/refresh-token") {
      const { accessToken, refreshToken } = (payload as RefreshTokenResType)
        .data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } else if (normalizedUrl === "api/auth/logout") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
