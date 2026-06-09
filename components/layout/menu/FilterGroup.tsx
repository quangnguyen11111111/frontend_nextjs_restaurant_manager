"use client";

import SidebarPanel from "@/components/layout/menu/SidebarPanel";

type FilterGroupProps = {
  title: string;
  options: string[];
};

export default function FilterGroup({ title, options }: FilterGroupProps) {
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
