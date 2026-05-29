"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { SHOP_NAME, SHOP_LOCATION } from "@/lib/constants";
import type { PurchaseReceipt, SalesReceipt } from "@/types";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

type Props =
  | { type: "sale"; receipt: SalesReceipt }
  | { type: "purchase"; receipt: PurchaseReceipt };

export function ReceiptPrint({ type, receipt }: Props) {
  const party =
    type === "sale"
      ? {
          label: "Customer",
          name: (receipt as SalesReceipt).customerName ?? "Walk-in",
          phone: (receipt as SalesReceipt).customerPhone,
        }
      : {
          label: "Vendor",
          name: (receipt as PurchaseReceipt).vendorName,
          phone: (receipt as PurchaseReceipt).vendorPhone,
        };

  return (
    <div>
      <div className="mb-4 flex justify-end print:hidden">
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print receipt
        </Button>
      </div>
      <div
        id="receipt"
        className="mx-auto max-w-lg rounded-2xl border border-[#e8d5c4] bg-white p-8 shadow-sm print:shadow-none print:border-0"
      >
        <div className="border-b border-dashed border-[#c9a227]/50 pb-4 text-center">
          <h1 className="font-serif text-2xl font-bold text-[#7a1f2e]">{SHOP_NAME}</h1>
          <p className="text-sm text-[#6b5a5a]">{SHOP_LOCATION}</p>
          <p className="mt-2 text-xs uppercase tracking-widest text-[#9a8a7a]">
            {type === "sale" ? "Sales Receipt" : "Purchase Receipt"}
          </p>
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <p>
            <span className="text-[#6b5a5a]">Receipt #:</span>{" "}
            <strong>{receipt.receiptNo}</strong>
          </p>
          <p>
            <span className="text-[#6b5a5a]">Date:</span> {formatDate(receipt.createdAt)}
          </p>
          <p>
            <span className="text-[#6b5a5a]">{party.label}:</span> {party.name}
          </p>
          {party.phone && (
            <p>
              <span className="text-[#6b5a5a]">Phone:</span> {party.phone}
            </p>
          )}
        </div>
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-[#f0e6dc] text-left text-[#6b5a5a]">
              <th className="pb-2">Item</th>
              <th className="pb-2 text-center">Qty</th>
              <th className="pb-2 text-right">Rate</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item) => (
              <tr key={item.id} className="border-b border-[#faf6f1]">
                <td className="py-2 pr-2">
                  <p className="font-medium">{item.saree.name}</p>
                  <p className="text-xs text-[#9a8a7a]">{item.saree.sku}</p>
                </td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">
                  {formatCurrency(
                    type === "sale"
                      ? (item as SalesReceipt["items"][0]).unitPrice
                      : (item as PurchaseReceipt["items"][0]).unitCost
                  )}
                </td>
                <td className="py-2 text-right font-medium">
                  {formatCurrency(item.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {type === "sale" && (receipt as SalesReceipt).discount > 0 && (
          <p className="mt-4 text-right text-sm text-[#6b5a5a]">
            Discount: −{formatCurrency((receipt as SalesReceipt).discount)}
          </p>
        )}
        <p className="mt-4 text-right text-xl font-bold text-[#7a1f2e]">
          Total: {formatCurrency(receipt.totalAmount)}
        </p>
        {receipt.notes && (
          <p className="mt-4 text-sm text-[#6b5a5a]">Note: {receipt.notes}</p>
        )}
        <p className="mt-8 text-center text-xs text-[#9a8a7a]">
          Thank you for shopping with {SHOP_NAME}!
        </p>
      </div>
    </div>
  );
}
