"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useAppStore } from "@/components/query-provider";
import { decodeToken, generateSocketInstace, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useGuestRecoverMutation } from "@/queries/useGuest";

export default function RecoverOrderPage() {
  const [customerPhone, setCustomerPhone] = useState("");
  const [sessionPin, setSessionPin] = useState("");
  const setRole = useAppStore(state => state.setRole);
  const setSocket = useAppStore(state => state.setSocket);
  const router = useRouter();
  const recoverMutation = useGuestRecoverMutation();

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || !sessionPin) {
      toast.error("Vui lòng nhập đầy đủ Số điện thoại và Mã đơn hàng (PIN)");
      return;
    }

    try {
      const res = await recoverMutation.mutateAsync({
        customer_phone: customerPhone,
        session_pin: sessionPin,
      });

      const data = res.payload.data;
      if (data.accessToken && data.refreshToken) {
        setAccessTokenToLocalStorage(data.accessToken);
        setRefreshTokenToLocalStorage(data.refreshToken);
        const decoded = decodeToken(data.accessToken);
        setRole(decoded.role);
        setSocket(generateSocketInstace(data.accessToken));
        toast.success("Phục hồi phiên thành công!");
        router.push("/guest/menu");
      }
    } catch (error: any) {
      toast.error(error.payload?.message || "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Khôi Phục Theo Dõi Đơn</CardTitle>
          <CardDescription className="text-center">
            Nhập số điện thoại và Mã xác nhận PIN đã lưu để tiếp tục theo dõi món
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRecover} className="space-y-4">
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input 
                required 
                type="tel" 
                value={customerPhone} 
                onChange={(e) => setCustomerPhone(e.target.value)} 
                placeholder="0901234567" 
              />
            </div>
            <div className="space-y-2">
              <Label>Mã đơn hàng (PIN)</Label>
              <Input 
                required 
                value={sessionPin} 
                onChange={(e) => setSessionPin(e.target.value.toUpperCase())} 
                placeholder="VD: ABCD" 
                className="uppercase"
                maxLength={4}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={recoverMutation.isPending}
            >
              {recoverMutation.isPending ? "Đang xử lý..." : "Tra Cứu / Khôi Phục"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => router.push("/")}
            >
              Về Trang Chủ
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
