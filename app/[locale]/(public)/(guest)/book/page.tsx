"use client";

import { useState } from "react";
import { useCheckCapacityQuery } from "@/queries/useCapacity";
import { useCreateReservationMutation } from "@/queries/useReservation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAppStore } from "@/components/query-provider";
import { decodeToken, generateSocketInstace, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function BookReservationPage() {
  const [step, setStep] = useState(1);
  const [guestCount, setGuestCount] = useState(2);
  const [targetDate, setTargetDate] = useState("");
  const [targetTime, setTargetTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState<any>(null);
  const setRole = useAppStore(state => state.setRole);
  const setSocket = useAppStore(state => state.setSocket);
  const router = useRouter();

  const targetDateTime = targetDate && targetTime ? `${targetDate}T${targetTime}:00` : "";

  const { data: capacityData, refetch: checkCapacity, isFetching } = useCheckCapacityQuery(
    { guest_count: guestCount, target_time: targetDateTime },
    false // Disable auto fetch until user clicks check
  );

  const createReservationMutation = useCreateReservationMutation();

  const handleCheckCapacity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestCount || !targetDate || !targetTime) {
      toast.error("Vui lòng chọn ngày, giờ và số người");
      return;
    }
    await checkCapacity();
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      toast.error("Vui lòng nhập tên và số điện thoại");
      return;
    }

    try {
      const res = await createReservationMutation.mutateAsync({
        guest_count: guestCount,
        reservation_time: targetDateTime,
        customer_name: customerName,
        customer_phone: customerPhone,
      });

      const data = res.payload.data as any; // any because schema doesn't have accessToken yet
      setReservationSuccess(data.order || data);

      if (data.accessToken && data.refreshToken) {
        setAccessTokenToLocalStorage(data.accessToken);
        setRefreshTokenToLocalStorage(data.refreshToken);
        const decoded = decodeToken(data.accessToken);
        setRole(decoded.role);
        setSocket(generateSocketInstace(data.accessToken));
      }

      setStep(2);
    } catch (error) {
      toast.error("Đặt bàn thất bại. Vui lòng thử lại.");
    }
  };

  const availableCount = capacityData?.payload.data.available_count ?? 0;

  if (step === 2 && reservationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f2f2b] p-4 pt-24">
        <Card className="max-w-md w-full bg-[#133631] border-emerald-800/50 text-white shadow-xl shadow-black/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-600">Đặt Bàn Thành Công!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p>Cảm ơn <strong>{reservationSuccess.customer_name}</strong> đã đặt bàn.</p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Mã xác nhận PIN (dùng để check-in nếu cần)</p>
              <p className="text-3xl font-bold tracking-widest">{reservationSuccess.session_pin}</p>
            </div>
            <p><strong>Thời gian:</strong> {format(new Date(reservationSuccess.reservation_time), "HH:mm dd/MM/yyyy")}</p>
            <p><strong>Số người:</strong> {reservationSuccess.guest_count}</p>
            <p className="text-sm text-muted-foreground mt-4">Vui lòng đến đúng giờ. Mã đặt bàn sẽ hết hạn sau 30 phút.</p>
            <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600" onClick={() => router.push("/guest/menu")}>
              Xem Thực Đơn & Theo Dõi Đơn
            </Button>
            <Button variant="outline" className="w-full mt-2" onClick={() => window.location.href = "/"}>
              Về Trang Chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f2f2b] p-4 pt-24">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-amber-500">Đặt Bàn Trước</h1>
          <p className="text-emerald-100/70 mt-2">Kiểm tra bàn trống và đặt chỗ ngay lập tức</p>
        </div>

        <Card className="bg-[#133631] border-emerald-800/50 text-white shadow-xl shadow-black/20">
          <CardHeader>
            <CardTitle>1. Kiểm tra sức chứa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckCapacity} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày</Label>
                  <Input type="date" required value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Giờ</Label>
                  <Input type="time" required value={targetTime} onChange={(e) => setTargetTime(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Số người</Label>
                <Input type="number" min="1" required value={guestCount} onChange={(e) => setGuestCount(parseInt(e.target.value))} />
              </div>
              <Button type="submit" className="w-full" disabled={isFetching}>
                {isFetching ? "Đang kiểm tra..." : "Kiểm tra bàn trống"}
              </Button>
            </form>

            {capacityData && (
              <div className="mt-4 space-y-2">
                <div className={`p-4 rounded-md text-center ${availableCount > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {availableCount > 0 
                    ? `Tuyệt vời! Nhà hàng có thể bố trí chỗ ngồi phù hợp cho ${guestCount} người.`
                    : "Rất tiếc! Không còn bàn trống trong khung giờ này."}
                </div>
                
                {availableCount > 0 && capacityData?.payload.data.is_tight_fit && (
                  <div className="p-3 rounded-md bg-yellow-500/20 text-yellow-200 text-sm border border-yellow-500/50">
                    ⚠️ <strong>Lưu ý:</strong> Vì số lượng bàn trống có hạn, nhà hàng sẽ bố trí chỗ ngồi hơi chật một chút so với tiêu chuẩn. Mong quý khách thông cảm!
                  </div>
                )}

                {availableCount > 0 && capacityData?.payload.data.requires_merge && (
                  <div className="p-3 rounded-md bg-blue-500/20 text-blue-200 text-sm border border-blue-500/50">
                    ℹ️ <strong>Ghép bàn:</strong> Nhà hàng sẽ tiến hành ghép các bàn lại với nhau để phục vụ đủ số lượng khách của bạn.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {capacityData && availableCount > 0 && (
          <Card className="bg-[#133631] border-emerald-800/50 text-white shadow-xl shadow-black/20">
            <CardHeader>
              <CardTitle>2. Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBook} className="space-y-4">
                <div className="space-y-2">
                  <Label>Họ và Tên</Label>
                  <Input required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nguyễn Văn A" />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input required type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="0901234567" />
                </div>
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                  Xác Nhận Đặt Bàn
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
