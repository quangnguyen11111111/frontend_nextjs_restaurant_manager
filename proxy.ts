import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = request.cookies.has("accessToken");
  //   Nếu chưa đăng nhập mà truy cập vào trang private thì chuyển hướng về login
  if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Nếu đã đăng nhập mà truy cập vào trang login thì chuyển hướng về dashboard
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/manage/dashboard", request.url));
  }
  console.log(pathname, isAuth);

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/manage/:path*"],
};
