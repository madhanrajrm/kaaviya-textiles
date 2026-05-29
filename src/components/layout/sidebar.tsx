"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  Package,
  ShoppingCart,
  Truck,
  Tags,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SHOP_NAME, SHOP_LOCATION } from "@/lib/constants";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sarees", label: "Saree Catalog", icon: Shirt },
  { href: "/stock", label: "Stock", icon: Package },
  { href: "/sales", label: "Sales Receipts", icon: ShoppingCart },
  { href: "/purchases", label: "Purchase Receipts", icon: Truck },
  { href: "/tags", label: "Tags (Soon)", icon: Tags, disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[#e8d5c4]/60 bg-gradient-to-b from-[#1a0f0f] to-[#2d1518] text-[#f5ebe0]">
      <div className="border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c9a227]/20 ring-1 ring-[#c9a227]/40">
            <Store className="h-6 w-6 text-[#c9a227]" />
          </div>
          <div>
            <p className="font-serif text-lg font-bold leading-tight text-white">{SHOP_NAME}</p>
            <p className="text-xs text-[#c9a227]/90">{SHOP_LOCATION}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          if (item.disabled) {
            return (
              <div
                key={item.href}
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/30"
                title="Coming soon"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </div>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#7a1f2e] text-white shadow-lg shadow-black/20"
                  : "text-[#f5ebe0]/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4 text-xs text-white/40">
        SQLite · 100% local · No payment required
      </div>
    </aside>
  );
}
