"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { LineItemBuilder, type DraftLine } from "@/components/receipts/line-item-builder";
import type { Saree } from "@/types";

export function NewSaleForm({ sarees }: { sarees: Saree[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState(0);
  const [lines, setLines] = useState<DraftLine[]>(
    sarees[0]
      ? [{ sareeId: sarees[0].id, quantity: 1, unitPrice: sarees[0].sellingPrice }]
      : []
  );

  if (sarees.length === 0) {
    return <p className="text-[#6b5a5a]">No sarees in stock. Add stock via purchase first.</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        customerPhone,
        notes,
        discount,
        items: lines,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed");
      setLoading(false);
      return;
    }
    const sale = await res.json();
    router.push(`/sales/${sale.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Customer name</Label>
          <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Optional" />
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Optional" />
        </div>
      </div>
      <LineItemBuilder sarees={sarees} lines={lines} onChange={setLines} mode="sale" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Discount (₹)</Label>
          <Input type="number" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
        </div>
        <div>
          <Label>Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating…" : "Create sales receipt"}
      </Button>
    </form>
  );
}
