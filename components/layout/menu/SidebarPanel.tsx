"use client";

import type { ReactNode } from "react";

type SidebarPanelProps = {
  title: string;
  children: ReactNode;
};

export default function SidebarPanel({ title, children }: SidebarPanelProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200/30 bg-[#143c36] shadow-[0_20px_40px_rgba(7,17,15,0.25)]">
      <div className="bg-amber-500/90 px-4 py-3 text-sm font-semibold uppercase text-white">
        {title}
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}
