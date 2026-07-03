import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";

interface WaitingItem {
  order_detail_id: number;
  table_number: number | string;
  quantity: number;
  ordered_at: string;
  note?: string;
  status: string;
}

interface DishCardProps {
  dish: {
    dish_id: number;
    dish_name: string;
    dish_image: string;
    total_quantity: number;
    pending_quantity?: number;
    processing_quantity?: number;
    waiting_list: WaitingItem[];
  };
  onMarkDone: (orderDetailId: number) => void;
  onMarkProcessing?: (orderDetailId: number) => void;
  onMarkAllProcessing?: (dishId: number) => void;
}

export default function DishCard({ dish, onMarkDone, onMarkProcessing, onMarkAllProcessing }: DishCardProps) {
  const getBadgeColor = (orderedAt: string) => {
    const minutesDiff = (new Date().getTime() - new Date(orderedAt).getTime()) / 60000;
    if (minutesDiff < 5) return "bg-green-500";
    if (minutesDiff < 15) return "bg-yellow-500 text-black";
    return "bg-red-500 animate-pulse";
  };

  return (
    <Card className="flex flex-col h-full border-2 overflow-hidden shadow-md">
      <CardHeader className="bg-muted pb-4 border-b flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          {dish.dish_image && (
            <div className="relative w-12 h-12 rounded-md overflow-hidden">
              <Image src={dish.dish_image} alt={dish.dish_name} fill className="object-cover" />
            </div>
          )}
          <div>
            <CardTitle className="text-xl font-bold">{dish.dish_name}</CardTitle>
            <div className="flex gap-2 mt-1 text-sm">
              <span className="text-gray-500 font-medium">Tổng: {dish.total_quantity}</span>
              <span className="text-red-500 font-medium">Chưa nấu: {dish.pending_quantity ?? 0}</span>
              <span className="text-orange-500 font-medium">Đang nấu: {dish.processing_quantity ?? 0}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold">
            {dish.total_quantity}
          </div>
          {dish.pending_quantity !== undefined && dish.pending_quantity > 0 && onMarkAllProcessing && (
            <Button size="sm" variant="outline" className="text-xs h-7 border-orange-500 text-orange-600 hover:bg-orange-50" onClick={() => onMarkAllProcessing(dish.dish_id)}>
              Nấu tất cả
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-y-auto max-h-[300px]">
        {dish.waiting_list.map((item) => (
          <div key={item.order_detail_id} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg">
                  {item.table_number === 'Mang đi' ? item.table_number : `Bàn ${item.table_number}`}
                </span>
                <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs font-bold">
                  x{item.quantity}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${getBadgeColor(item.ordered_at)}`} />
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.ordered_at), { addSuffix: true, locale: vi })}
                </span>
              </div>
              {item.note && (
                <p className="text-sm italic text-orange-500 mt-1">Lưu ý: {item.note}</p>
              )}
            </div>
            <div>
              {item.status === 'Pending' ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                  onClick={() => onMarkProcessing && onMarkProcessing(item.order_detail_id)}
                >
                  NẤU
                </Button>
              ) : (
                <Button size="sm" onClick={() => onMarkDone(item.order_detail_id)}>XONG</Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
