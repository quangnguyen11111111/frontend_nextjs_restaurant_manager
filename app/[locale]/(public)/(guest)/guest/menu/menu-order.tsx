"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import dishApiRequest from "@/apiRequest/dish";
import {
  flattenCategoryTree,
  formatCurrency,
  getDataCartFromLocalStorage,
  handleErrorApi,
  removeDataCartFromLocalStorage,
  setDataCartToLocalStorage,
} from "@/lib/utils";
import { useGetCategoryTreeQuery } from "@/queries/useCategory";
import { DishResType } from "@/schemaValidations/dish.schema";
import CategoryTree from "@/components/layout/menu/CategoryTree";
import DishesList from "@/components/layout/menu/DishesList";
import FilterGroup from "@/components/layout/menu/FilterGroup";
import SidebarPanel from "@/components/layout/menu/SidebarPanel";
import { useGuestOrderMutation } from "@/queries/useGuest";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MenuOrder() {
  const { data: categoryTreeData, isLoading } = useGetCategoryTreeQuery();
  const categoryOptions = () =>
    flattenCategoryTree(categoryTreeData?.payload.data ?? []);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const { mutateAsync } = useGuestOrderMutation();
  const [cart, setCart] = useState<{ dishId: number; quantity: number }[]>([]);
  useEffect(() => {
    const cartFromStorage = getDataCartFromLocalStorage();
    setCart(cartFromStorage);
  }, []);
  const handleAddToCart = (dishId: number, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.dishId === dishId);
      let nextCart = prevCart;

      if (!existingItem) {
        if (quantity > 0) {
          nextCart = [...prevCart, { dishId, quantity }];
        }
      } else {
        nextCart = prevCart
          .map((item) =>
            item.dishId === dishId
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item,
          )
          .filter((item) => item.quantity > 0);
      }

      setDataCartToLocalStorage(nextCart);
      return nextCart;
    });
  };

  const cartQuantity = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart],
  );

  const cartDishIds = useMemo(
    () => Array.from(new Set(cart.map((item) => item.dishId))),
    [cart],
  );

  const dishDetailQueries = useQueries({
    queries: cartDishIds.map((dishId) => ({
      queryKey: ["dish-detail", dishId],
      queryFn: () => dishApiRequest.getDetail(dishId),
      enabled: Boolean(dishId),
    })),
  });

  const dishById = useMemo(() => {
    const map = new Map<number, DishResType["data"]>();
    dishDetailQueries.forEach((query, index) => {
      const payload = query.data?.payload?.data;
      if (payload && !Array.isArray(payload)) {
        map.set(cartDishIds[index], payload);
      }
    });
    return map;
  }, [cartDishIds, dishDetailQueries]);

  const cartItems = useMemo(
    () =>
      cart.map((item) => ({
        ...item,
        dish: dishById.get(item.dishId) ?? null,
      })),
    [cart, dishById],
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + (item.dish ? item.dish.price * item.quantity : 0),
        0,
      ),
    [cartItems],
  );

  const isMiniCartLoading = useMemo(
    () => dishDetailQueries.some((query) => query.isLoading),
    [dishDetailQueries],
  );
  const router = useRouter();
  const handleOrder = async () => {
    try {
      await mutateAsync(cart);
      toast.success("Đặt món thành công!");
      setCart([]);
      removeDataCartFromLocalStorage();
      router.push(`/guest/orders`);
    } catch (error) {
      handleErrorApi({
        error,
      });
      toast.error("Đặt món thất bại!");
    }
  };
  return (
    <section className="relative isolate overflow-hidden bg-[#0f2f2b] px-6 py-14 text-white shadow-[0_30px_80px_rgba(8,21,18,0.45)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#204c45_0%,#0f2f2b_60%)]" />
      <div className="absolute -left-12 top-1/3 -z-10 h-40 w-40 rounded-full border border-emerald-400/10" />
      <div className="absolute -right-10 bottom-16 -z-10 h-48 w-48 rounded-full border border-emerald-300/15" />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6">
            <SidebarPanel title="Danh mục sản phẩm">
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 w-3/4 rounded bg-emerald-700/50" />
                  <div className="h-4 w-1/2 rounded bg-emerald-700/50" />
                  <div className="h-4 w-5/6 rounded bg-emerald-700/50" />
                </div>
              ) : (
                <CategoryTree
                  categories={categoryOptions()}
                  onSelectCategory={setSelectedCategoryId}
                  selectedId={selectedCategoryId}
                />
              )}
            </SidebarPanel>

            <FilterGroup
              title="Chọn mức giá"
              options={[
                "Dưới 100.000đ",
                "Từ 100.000đ - 200.000đ",
                "Từ 200.000đ - 500.000đ",
                "Từ 500.000đ - 1 triệu",
                "Trên 1 triệu",
              ]}
            />

            <FilterGroup
              title="Hương vị"
              options={["Mặn", "Ngọt", "Chua", "Cay"]}
            />

            <FilterGroup title="Kích cỡ" options={["Lớn", "Vừa", "Nhỏ"]} />
          </aside>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold uppercase text-amber-200">
                  Tất cả món ăn
                </h2>
                <div className="hidden h-px w-36 bg-amber-200/40 md:block" />
              </div>
              <button className="flex items-center gap-2 rounded-full bg-amber-500/90 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-400">
                Sắp xếp: Mặc định
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <DishesList
              selectedCategoryId={selectedCategoryId}
              itemsPerPage={10}
              handleAddToCart={handleAddToCart}
            />
          </div>
        </div>

        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-64">
          <div className="relative group">
            <div className="pointer-events-none absolute bottom-16 left-0 right-0 z-30 translate-y-2 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto md:left-auto md:right-0 md:w-80">
              <div className="rounded-2xl bg-white p-4 text-slate-900 shadow-[0_25px_60px_rgba(8,21,18,0.35)]">
                <div className="flex items-center justify-between text-sm font-semibold text-emerald-900">
                  <span>Giỏ hàng của bạn</span>
                  <span className="text-amber-600">{cartQuantity} món</span>
                </div>

                <div className="mt-3 max-h-64 space-y-3 overflow-y-auto pr-1">
                  {cartItems.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50/70 px-3 py-4 text-center text-xs text-amber-700">
                      Giỏ hàng đang trống.
                    </div>
                  ) : (
                    cartItems.map((item) => {
                      const dish = item.dish;
                      return (
                        <div
                          key={item.dishId}
                          className="flex items-center gap-3"
                        >
                          <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                            {dish ? (
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full animate-pulse bg-slate-200" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {dish ? dish.name : "Đang tải món ăn..."}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.quantity} x{" "}
                              {dish ? formatCurrency(dish.price) : "..."}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              className="h-6 w-6 rounded-full border border-amber-200 text-xs font-semibold text-amber-700 transition hover:border-amber-400 hover:text-amber-600"
                              onClick={() => handleAddToCart(item.dishId, -1)}
                              aria-label="Giam so luong"
                            >
                              -
                            </button>
                            <span className="min-w-6 text-center text-xs font-semibold text-emerald-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="h-6 w-6 rounded-full border border-amber-200 text-xs font-semibold text-amber-700 transition hover:border-amber-400 hover:text-amber-600"
                              onClick={() => handleAddToCart(item.dishId, 1)}
                              aria-label="Tang so luong"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-semibold text-emerald-900">
                  <span>Tổng tiền</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <Button
                  className="mt-3 w-full bg-amber-500 text-white hover:bg-amber-400"
                  onClick={handleOrder}
                  disabled={cartItems.length === 0 || isMiniCartLoading}
                >
                  Đặt món
                </Button>
              </div>
            </div>

            <Button className="h-12 w-full justify-between bg-amber-500 text-base text-white hover:bg-amber-400">
              <span>Giỏ hàng</span>
              <span className="rounded-full bg-amber-400 px-2 py-0.5 text-amber-900">
                {cartQuantity}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
