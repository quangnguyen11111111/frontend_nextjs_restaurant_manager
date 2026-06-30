import { Role } from "@/constants/type";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { TokenPayload } from "@/types/jwt.types";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/config";
import { decodeToken } from "./lib/utils";
const managePaths = ["/vi/manage", "/en/manage"];
const guestPaths = ["/vi/guest", "/en/guest"];
const onlyOwnerPaths = [
  "/vi/manage/accounts",
  "/en/manage/accounts",
  "/vi/manage/dishes",
  "/en/manage/dishes",
  "/vi/manage/categories",
  "/en/manage/categories",
];
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/vi/login", "/en/login"];
const loginPaths = ["/vi/login", "/en/login"];
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
  });
  const response = handleI18nRouting(request);
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const accessToken = request.cookies.get("accessToken")?.value;
  const locale = request.cookies.get("NEXT_LOCALE")?.value ?? defaultLocale;
  // Bỏ qua trang khôi phục đơn hàng và menu để ai cũng có thể vào
  const isGuestRecoverPath = pathname.startsWith(`/${locale}/guest/recover`);
  const isGuestMenuPath = pathname.startsWith(`/${locale}/guest/menu`);
  const isPublicGuestPath = isGuestRecoverPath || isGuestMenuPath;

  //   Nếu chưa đăng nhập mà truy cập vào trang private thì chuyển hướng về login
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken && !isPublicGuestPath) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
  if (refreshToken) {
    // Nếu đã đăng nhập mà truy cập vào trang login thì chuyển hướng về dashboard
    if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
      return NextResponse.redirect(
        new URL(`/${locale}/manage/dashboard`, request.url),
      );
    }

    // 2.3 Vào không đúng role, redirect về trang chủ
    const role = decodeToken(refreshToken).role;
    // Guest nhưng cố vào route owner
    const isGuestGoToManagePath =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path));
    // Không phải Guest nhưng cố vào route guest (ngoại trừ trang recover/menu vì ai cũng được vào)
    const isNotGuestGoToGuestPath =
      role !== Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path)) &&
      !isPublicGuestPath;
    // Không phải Owner nhưng cố tình truy cập vào các route dành cho owner
    const isNotOwnerGoToOwnerPath =
      role !== Role.Owner &&
      onlyOwnerPaths.some((path) => pathname.startsWith(path));
    if (
      isGuestGoToManagePath ||
      isNotGuestGoToGuestPath ||
      isNotOwnerGoToOwnerPath
    ) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
      // response.headers.set(
      //   'x-middleware-rewrite',
      //   new URL('/', request.url).toString()
      // )
      // return response
    }
    return response;
  }
  return response;
}
export const config = {
  matcher: ["/((?!api|next-api|_next|.*\\..*).*)"],
};
