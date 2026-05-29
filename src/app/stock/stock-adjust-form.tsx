"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import type { Saree } from "@/types";

export function StockAdjustForm({ sarees }: { sarees: Saree[] }) {
  const router = useRouter();
  const [sareeId, setSareeId] = useState(sarees[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/stock/adjust", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sareeId, quantity, notes }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed");
      setLoading(false);
      return;
    }
    router.refresh();
    setNotes("");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div>
        <Label>Saree</Label>
        <Select value={sareeId} onChange={(e) => setSareeId(e.target.value)}>
          {sarees.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.stockQuantity})
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Change (+ add / − remove)</Label>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
        <p className="mt-1 text-xs text-[#9a8a7a]">Use negative numbers to reduce stock</p>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Updating…" : "Apply adjustment"}
      </Button>
    </form>
  );
}
