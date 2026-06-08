"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGuestJoinMutation, useHostOpenMutation } from "@/queries/useSession";
import { handleErrorApi } from "@/lib/utils";

export default function GuestSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableNumberStr = searchParams.get("tableNumber");
  const hasActiveSessionStr = searchParams.get("hasActiveSession");
  
  const tableNumber = tableNumberStr ? parseInt(tableNumberStr, 10) : 0;
  const hasActiveSession = hasActiveSessionStr === "true";

  const [pin, setPin] = useState("");
  const [generatedPin, setGeneratedPin] = useState("");
  const [showPinDialog, setShowPinDialog] = useState(false);
  const hostOpenMutation = useHostOpenMutation();
  const guestJoinMutation = useGuestJoinMutation();

  useEffect(() => {
    if (!tableNumber) {
      router.push("/");
    }
  }, [tableNumber, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hasActiveSession && (!pin || pin.length < 4)) return;

    try {
      if (hasActiveSession) {
        await guestJoinMutation.mutateAsync({
          table_number: tableNumber,
          session_pin: pin,
        });
      } else {
        const res = await hostOpenMutation.mutateAsync({
          table_number: tableNumber,
          // guest_count can be asked later, but for simplicity we default to 1 on backend
          // We could add a guest_count input here for Host, but let's keep it simple.
        });
        const newPin = res.payload.data.session_pin;
        if (newPin) {
          setGeneratedPin(newPin);
          setShowPinDialog(true);
          return; // Do not redirect yet
        }
      }
      router.push("/guest/menu");
    } catch (error) {
      handleErrorApi({ error });
    }
  }

  return (
    <div className="h-[90vh] flex items-center justify-center bg-muted/20">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {hasActiveSession ? "Vào Bàn" : "Mở Bàn"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2 text-center text-sm text-muted-foreground">
              {hasActiveSession 
                ? "Bàn này đã được mở. Vui lòng nhập mã PIN từ Host (người mở bàn) để truy cập."
                : "Bạn là người đầu tiên tại bàn. Hệ thống sẽ tạo một mã PIN ngẫu nhiên. Vui lòng ghi nhớ mã PIN này để chia sẻ với người khác."}
            </div>
            
            {hasActiveSession && (
              <div className="space-y-2">
                <Label htmlFor="pin">Mã PIN</Label>
                <Input 
                  id="pin" 
                  type="text" 
                  maxLength={4}
                  required 
                  value={pin}
                  onChange={(e) => setPin(e.target.value.toUpperCase())}
                  placeholder="VD: ABCD" 
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={hasActiveSession && pin.length < 4}>
              {hasActiveSession ? "Join" : "Tạo mã PIN & Mở Bàn"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mở bàn thành công!</AlertDialogTitle>
            <AlertDialogDescription asChild className="text-center space-y-4">
              <div>
                <div className="text-base">Mã PIN của bàn là:</div>
                <div className="text-4xl font-bold tracking-widest text-primary">{generatedPin}</div>
                <div className="text-sm">Hãy chia sẻ mã PIN này cho các thành viên khác tại bàn để họ có thể cùng tham gia gọi món.</div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push("/guest/menu")}>
              Vào Menu Gọi Món
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
