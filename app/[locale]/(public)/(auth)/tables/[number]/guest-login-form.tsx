"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/schemaValidations/guest.schema";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useGuestLoginMutation } from "@/queries/useGuest";
import { useEffect } from "react";
import { decodeToken, generateSocketInstace, handleErrorApi } from "@/lib/utils";
import { useAppStore } from "@/components/query-provider";

export default function GuestLoginForm() {
  const searchParams = useSearchParams();
  const params = useParams();
  const tableNumber = Number(params.number);
  const token = searchParams.get("token");
  const router = useRouter();
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);
  const loginMutation = useGuestLoginMutation();
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      token: token ?? "",
      tableNumber,
    },
  });
  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  async function onSubmit(values: GuestLoginBodyType) {
    if (loginMutation.isPending) return;
    try {
      // const result = await loginMutation.mutateAsync(values);
      const res = await loginMutation.mutateAsync(values);
      
      const payloadData = (res.payload as any)?.data;
      const accessToken = payloadData?.accessToken;
      
      if (accessToken) {
        const decoded = decodeToken(accessToken);
        setRole(decoded.role);
        setSocket(generateSocketInstace(accessToken));
      }

      const hasActiveSession = payloadData?.hasActiveSession;

      router.push(`/guest/session?tableNumber=${tableNumber}&hasActiveSession=${hasActiveSession}`);
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f2f2b] p-4">
      <Card className="mx-auto max-w-sm w-full bg-[#133631] border-emerald-800/50 text-white shadow-xl shadow-black/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-amber-500">Đăng nhập gọi món</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
          <form
            className="space-y-2 max-w-150 shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, console.log)}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-emerald-100">Tên khách hàng</Label>
                      <Input id="name" type="text" required {...field} className="bg-[#1a403a] border-emerald-800/50 text-white placeholder:text-emerald-700/50 focus-visible:ring-amber-500" />
                      <FormMessage className="text-red-400" />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" isLoading={loginMutation.isPending} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold transition-colors">
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
    </div>
  );
}
