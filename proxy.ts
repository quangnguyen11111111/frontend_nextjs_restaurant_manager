import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import authApiRequest from "./apiRequest/auth";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = request.cookies.has("accessToken");
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const accessToken = request.cookies.get("accessToken")?.value;
  //   Nếu chưa đăng nhập mà truy cập vào trang private thì chuyển hướng về login
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Nếu đã đăng nhập mà truy cập vào trang login thì chuyển hướng về dashboard
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL("/manage/dashboard", request.url));
  }
  // Đăng nhập rồi nhưng accessToken hết hạn thif đăng xuất
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    refreshToken &&
    !accessToken
  ) {
    try {
      fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
      });
      return NextResponse.redirect(new URL("/login", request.url));
    } catch (error) {
      console.log(error);
    }
  }
  console.log(pathname, isAuth);

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/manage/:path*"],
};
