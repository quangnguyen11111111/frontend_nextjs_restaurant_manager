import authApiRequest from "@/apiRequest/auth";
import { cookies } from "next/headers";
import { th } from "zod/locales";
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  if (!refreshToken) {
    return Response.json({ message: "Tokens not found" }, { status: 200 });
  }
  try {
    const result = await authApiRequest.sLogout({
      refreshToken,
    });
    return Response.json(result.payload);
  } catch (error: any) {
    return Response.json({ message: "Internal Server Error" }, { status: 200 });
  }
}
