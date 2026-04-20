import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import authApiRequest from "@/apiRequest/auth";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Xoá đi kí tự `/` đầu tiên của path
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};
export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast.error(error?.payload?.message ?? "Lỗi không xác định", {
      duration: duration ?? 3000,
    });
  }
};
const isBrowser = typeof window !== "undefined";
export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") || null : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") || null : null;
export const setAccessTokenToLocalStorage = (token: string) =>
  isBrowser && localStorage.setItem("accessToken", token);

export const setRefreshTokenToLocalStorage = (token: string) =>
  isBrowser && localStorage.setItem("refreshToken", token);

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  // Nếu không có accessToken hoặc refreshToken, không thực hiện gì (chua đăng nhập hoặc đã đăng xuất)
  if (!accessToken || !refreshToken) return;
  let decodedAccessToken: any;
  let decodedRefreshToken: any;

  try {
    decodedAccessToken = jwt.decode(accessToken);
    decodedRefreshToken = jwt.decode(refreshToken);

    if (
      !decodedAccessToken ||
      !decodedRefreshToken ||
      !decodedAccessToken.exp ||
      !decodedRefreshToken.exp
    ) {
      // Nếu token không decode được thì token đã bị chỉnh sửa logout luôn
      await authApiRequest.cLogout();
      return redirect("/login");
    }
  } catch (error) {
    // Nếu token không decode được thì token đã bị chỉnh sửa logout luôn
    await authApiRequest.cLogout();
    return redirect("/login");
  }
  const now = new Date().getTime() / 1000 - 1; // Lấy thời gian hiện tại (đơn vị giây) trừ đi 1 giây để tránh trường hợp token vừa hết hạn
  // Nếu refreshToken đã hết hạn thif đăng xuất luôn
  if (decodedRefreshToken.exp < now) {
    await authApiRequest.cLogout();
    return redirect("/login");
  }
  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    try {
      const res = await authApiRequest.cRefreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      setTimeout(() => {
        param?.onSuccess && param.onSuccess();
      }, 1000);
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};
