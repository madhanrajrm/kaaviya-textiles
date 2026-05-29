"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import type { Saree } from "@/types";

export type DraftLine = {
  sareeId: string;
  quantity: number;
  unitCost?: number;
  unitPrice?: number;
};

export function LineItemBuilder({
  sarees,
  lines,
  onChange,
  mode,
}: {
  sarees: Saree[];
  lines: DraftLine[];
  onChange: (lines: DraftLine[]) => void;
  mode: "purchase" | "sale";
}) {
  function addLine() {
    const first = sarees[0];
    if (!first) return;
    onChange([
      ...lines,
      {
        sareeId: first.id,
        quantity: 1,
        ...(mode === "purchase"
          ? { unitCost: first.costPrice }
          : { unitPrice: first.sellingPrice }),
      },
    ]);
  }

  function updateLine(index: number, patch: Partial<DraftLine>) {
    const next = [...lines];
    next[index] = { ...next[index], ...patch };
    if (patch.sareeId) {
      const saree = sarees.find((s) => s.id === patch.sareeId);
      if (saree) {
        if (mode === "purchase") next[index].unitCost = saree.costPrice;
        else next[index].unitPrice = saree.sellingPrice;
      }
    }
    onChange(next);
  }

  const total = lines.reduce((sum, line) => {
    const rate = mode === "purchase" ? line.unitCost ?? 0 : line.unitPrice ?? 0;
    return sum + line.quantity * rate;
  }, 0);

  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        const saree = sarees.find((s) => s.id === line.sareeId);
        const rate = mode === "purchase" ? line.unitCost ?? 0 : line.unitPrice ?? 0;
        return (
          <div
            key={i}
            className="grid gap-3 rounded-xl border border-[#f0e6dc] bg-[#faf6f1]/50 p-4 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]"
          >
            <div>
              <Label>Saree</Label>
              <Select
                value={line.sareeId}
                onChange={(e) => updateLine(i, { sareeId: e.target.value })}
              >
                {sarees.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (stock: {s.stockQuantity})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Qty</Label>
              <Input
                type="number"
                min={1}
                max={mode === "sale" ? saree?.stockQuantity : undefined}
                value={line.quantity}
                onChange={(e) => updateLine(i, { quantity: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>{mode === "purchase" ? "Unit cost" : "Unit price"}</Label>
              <Input
                type="number"
                min={0}
                value={rate}
                onChange={(e) =>
                  updateLine(
                    i,
                    mode === "purchase"
                      ? { unitCost: Number(e.target.value) }
                      : { unitPrice: Number(e.target.value) }
                  )
                }
              />
            </div>
            <div className="flex items-end">
              <p className="pb-2 text-sm font-semibold text-[#7a1f2e]">
                {formatCurrency(line.quantity * rate)}
              </p>
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                className="!text-red-600"
                onClick={() => onChange(lines.filter((_, j) => j !== i))}
                disabled={lines.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={addLine}>
          <Plus className="h-4 w-4" />
          Add line
        </Button>
        <p className="text-lg font-bold text-[#7a1f2e]">Subtotal: {formatCurrency(total)}</p>
      </div>
    </div>
  );
}
