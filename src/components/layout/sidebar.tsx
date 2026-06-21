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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SHOP_NAME, SHOP_LOCATION } from "@/lib/constants";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sarees", label: "Saree Catalog", icon: Shirt },
  { href: "/variants", label: "Variants", icon: Tags },
  { href: "/stock", label: "Stock", icon: Package },
  { href: "/sales", label: "Sales Receipts", icon: ShoppingCart },
  { href: "/purchases", label: "Purchase Receipts", icon: Truck },
  { href: "/tags", label: "Tags (Soon)", icon: Tags, disabled: true },
];

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col overflow-y-auto border-r border-slate-800 bg-slate-950 text-slate-100 shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="border-b border-slate-800 px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700">
              <Store className="h-6 w-6 text-sky-400" />
            </div>
            <div>
              <p className="font-serif text-lg font-bold leading-tight text-white">{SHOP_NAME}</p>
              <p className="text-xs text-slate-400">{SHOP_LOCATION}</p>
            </div>
          </div>
          {onClose ? (
            <button
              type="button"
              className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            if (item.disabled) {
              return (
                <div
                  key={item.href}
                  className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500"
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
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
                onClick={onClose}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4 text-xs text-slate-500">
          SQLite · 100% local · No payment required
        </div>
      </aside>
    </>
  );
}
