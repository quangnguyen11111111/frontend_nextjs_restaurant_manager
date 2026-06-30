import authApiRequest from "@/apiRequest/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const cokieStore = await cookies();
  const refreshToken = cokieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json(
      { message: "Refresh token not found" },
      { status: 401 },
    );
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({
      refreshToken,
    });
    
    const decodedAccessToken = jwt.decode(payload.data.accessToken) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as {
      exp: number;
    };
    cokieStore.set("accessToken", payload.data.accessToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: decodedAccessToken.exp * 1000,
    });
    cokieStore.set("refreshToken", payload.data.refreshToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error: any) {
    return Response.json(
      { message: error.message ?? "Invalid refresh token" },
      { status: 401 },
    );
  }
}
