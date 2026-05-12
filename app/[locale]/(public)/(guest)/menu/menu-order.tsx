"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { flattenCategoryTree, formatCurrency } from "@/lib/utils";
import { useGetCategoryTreeQuery } from "@/queries/useCategory";
import { useSearchParams } from "next/navigation";
import { useGetDishListByCategoryQuery } from "@/queries/useDish";

type Category = {
  id: number;
  name: string;
  parent_id: number | null;
};

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image: string;
  original_price?: number;
  discount_percent?: number;
};

function SidebarPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200/30 bg-[#143c36] shadow-[0_20px_40px_rgba(7,17,15,0.25)]">
      <div className="bg-amber-500/90 px-4 py-3 text-sm font-semibold uppercase text-white">
        {title}
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

function FilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <SidebarPanel title={title}>
      <div className="space-y-2 text-sm text-emerald-50">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input type="checkbox" className="accent-amber-500" />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </SidebarPanel>
  );
}

function CategoryTree({
  categories,
  onSelectCategory,
  selectedId,
}: {
  categories: Category[];
  onSelectCategory: (id: number) => void;
  selectedId: number | null;
}) {
  const [expandedIds, setExpandedIds] = useState(() => {
    const firstRoot = categories.find((cat) => cat.parent_id === null);
    return new Set<number>(firstRoot ? [firstRoot.id] : []);
  });

  const getCategoryChildren = (parentId: number) => {
    return categories.filter((cat) => cat.parent_id === parentId);
  };

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const TreeNode = ({
    category,
    level = 0,
  }: {
    category: Category;
    level?: number;
  }) => {
    const children = getCategoryChildren(category.id);
    const isExpanded = expandedIds.has(category.id);
    const hasChildren = children.length > 0;

    return (
      <div key={category.id}>
        <div
          className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition ${
            selectedId === category.id
              ? "bg-amber-500/20 text-amber-50"
              : "text-emerald-50 hover:bg-white/5"
          }`}
          style={{ marginLeft: `${level * 16}px` }}
          onClick={() => onSelectCategory(category.id)}
        >
          {hasChildren && (
            <button
              className="h-4 w-4 text-emerald-100"
              onClick={(event) => {
                event.stopPropagation();
                toggleExpand(category.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          <span className="flex-1">{category.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {children.map((child) => (
              <TreeNode key={child.id} category={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {categories
        .filter((cat) => cat.parent_id === null)
        .map((cat) => (
          <TreeNode key={cat.id} category={cat} />
        ))}
    </div>
  );
}

function DishesList({
  selectedCategoryId,
}: {
  selectedCategoryId: number | null;
  itemsPerPage?: number;
}) {
  const searchParam = useSearchParams();

  const page = Number(searchParam.get("page")) || 1;

  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const { data: dishListData, isLoading } = useGetDishListByCategoryQuery({
    page: currentPage,
    categoryId: selectedCategoryId ?? 0,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-3xl bg-white/95 text-slate-900 shadow-[0_20px_40px_rgba(7,17,15,0.18)]"
          />
        ))}
      </div>
    );
  }

  const data = dishListData?.payload.data ?? [];
  const paginationMeta = dishListData?.payload.pagination;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((dish) => {
          return (
            <article
              key={dish.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/95 text-slate-900 shadow-[0_20px_40px_rgba(7,17,15,0.18)] transition hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  loading="lazy"
                  className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute -bottom-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-amber-500 text-white shadow">
                  <Heart className="h-4 w-4" />
                </div>
              </div>

              <div className="flex flex-1 flex-col items-center gap-2 px-4 pb-5 pt-8 text-center">
                <h4 className="text-sm font-semibold leading-snug text-slate-900 line-clamp-2">
                  {dish.name}
                </h4>
                <div className="flex items-center gap-2 text-sm font-bold text-amber-600">
                  <span>{formatCurrency(dish.price)}</span>
                </div>
                <button className="mt-auto rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-amber-400">
                  Xem chi tiết
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {paginationMeta && paginationMeta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            className="rounded-lg border border-amber-200/40 px-3 py-1 text-sm text-amber-50 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          <div className="flex gap-2">
            {Array.from(
              { length: paginationMeta.totalPages },
              (_, i) => i + 1,
            ).map((page) => (
              <button
                key={page}
                className={`h-8 w-8 rounded-lg text-sm font-semibold transition ${
                  currentPage === page
                    ? "bg-amber-500 text-white"
                    : "border border-amber-200/40 text-amber-50 hover:bg-amber-500/20"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="rounded-lg border border-amber-200/40 px-3 py-1 text-sm text-amber-50 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(paginationMeta.totalPages, page + 1),
              )
            }
            disabled={currentPage === paginationMeta.totalPages}
          >
            ›
          </button>
        </div>
      )}

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Không có món ăn trong danh mục này</p>
        </div>
      )}
    </div>
  );
}

export default function MenuOrder() {
  const { data: categoryTreeData, isLoading } = useGetCategoryTreeQuery();
  const categoryOptions = () =>
    flattenCategoryTree(categoryTreeData?.payload.data ?? []);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  useEffect(() => {
    if (categoryOptions().length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(categoryOptions()[0].id);
    }
  }, [categoryOptions, selectedCategoryId]);
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
            />
          </div>
        </div>

        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-64">
          <Button className="h-12 w-full justify-between bg-amber-500 text-base text-white hover:bg-amber-400">
            <span>Giỏ hàng</span>
            <span>100,000 đ</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
