"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { LineItemBuilder, type DraftLine } from "@/components/receipts/line-item-builder";
import type { Saree } from "@/types";

export function NewPurchaseForm({ sarees }: { sarees: Saree[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<DraftLine[]>(
    sarees[0]
      ? [{ sareeId: sarees[0].id, quantity: 1, unitCost: sarees[0].costPrice }]
      : []
  );

  if (sarees.length === 0) {
    return <p className="text-[#6b5a5a]">Add sarees to the catalog first.</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vendorName.trim()) {
      setError("Vendor name is required");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorName, vendorPhone, notes, items: lines }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed");
      setLoading(false);
      return;
    }
    const purchase = await res.json();
    router.push(`/purchases/${purchase.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Vendor name *</Label>
          <Input value={vendorName} onChange={(e) => setVendorName(e.target.value)} required />
        </div>
        <div>
          <Label>Vendor phone</Label>
          <Input value={vendorPhone} onChange={(e) => setVendorPhone(e.target.value)} />
        </div>
      </div>
      <LineItemBuilder sarees={sarees} lines={lines} onChange={setLines} mode="purchase" />
      <div>
        <Label>Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <Button type="submit" variant="secondary" disabled={loading}>
        {loading ? "Creating…" : "Create purchase receipt"}
      </Button>
    </form>
  );
}
