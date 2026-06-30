"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

type Category = {
  id: number;
  name: string;
  parent_id: number | null;
};

type CategoryTreeProps = {
  categories: Category[];
  onSelectCategory: (id: number) => void;
  selectedId: number | null;
};

export default function CategoryTree({
  categories,
  onSelectCategory,
  selectedId,
}: CategoryTreeProps) {
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
          className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition ${
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
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
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
      <div
        className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition ${
          selectedId === 0
            ? "bg-amber-500/20 text-amber-50"
            : "text-emerald-50 hover:bg-white/5"
        }`}
        onClick={() => onSelectCategory(0)}
      >
        <div className="w-4" />
        <span className="flex-1">Tất cả món ăn</span>
      </div>
      {categories
        .filter((cat) => cat.parent_id === null)
        .map((cat) => (
          <TreeNode key={cat.id} category={cat} />
        ))}
    </div>
  );
}
