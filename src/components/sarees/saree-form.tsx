"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { PRICE_POINTS } from "@/lib/constants";
import type { Saree, VariantCategory } from "@/types";

type NewVariant = {
  name: string;
};

type Props = {
  variants: VariantCategory[];
  initial?: Saree;
};

export function SareeForm({ variants, initial }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newVariantName, setNewVariantName] = useState("");
  const [variantError, setVariantError] = useState("");

  const [form, setForm] = useState({
    sku: initial?.sku ?? "",
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    variantId: initial?.variantId ?? variants[0]?.id ?? "",
    color: initial?.color ?? "",
    pattern: initial?.pattern ?? "",
    imageUrl: initial?.imageUrl ?? "",
    costPrice: initial?.costPrice ?? 200,
    sellingPrice: initial?.sellingPrice ?? 500,
    stockQuantity: initial?.stockQuantity ?? "",
    lowStockThreshold: initial?.lowStockThreshold ?? 5,
    tagCode: initial?.tagCode ?? "",
  });
  const [localVariants, setLocalVariants] = useState(variants);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.variantId && !newVariantName.trim()) {
      setVariantError("A variant is required before saving.");
      setLoading(false);
      return;
    }

    const formData = { ...form };
    if (newVariantName.trim()) {
      const variantRes = await fetch("/api/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newVariantName.trim() }),
      });

      if (!variantRes.ok) {
        const data = await variantRes.json();
        setVariantError(data.error ?? "Unable to create variant");
        setLoading(false);
        return;
      }

      const variant: NewVariant & { id: string } = await variantRes.json();
      formData.variantId = variant.id;
      setLocalVariants((current) => [...current, variant]);
      setNewVariantName("");
    }

    const url = initial ? `/api/sarees/${initial.id}` : "/api/sarees";
    const method = initial ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      setLoading(false);
      return;
    }

    router.push("/sarees");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            required
            disabled={!!initial}
          />
        </div>
        <div>
          <Label htmlFor="variantId">Variant</Label>
           <Select
            id="variantId"
            value={form.variantId}
            onChange={(e) => setForm({ ...form, variantId: e.target.value })}
            required
          >
            {localVariants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </Select>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">Create a new variant</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Input
                value={newVariantName}
                onChange={(e) => {
                  setNewVariantName(e.target.value);
                  setVariantError("");
                }}
                placeholder="e.g. Banaras"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  if (!newVariantName.trim()) {
                    setVariantError("Enter a variant name");
                    return;
                  }
                  const variantRes = await fetch("/api/variants", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newVariantName.trim() }),
                  });
                  if (!variantRes.ok) {
                    const data = await variantRes.json();
                    setVariantError(data.error ?? "Unable to create variant");
                    return;
                  }
                  const variant: NewVariant & { id: string } = await variantRes.json();
                  setForm({ ...form, variantId: variant.id });
                  setLocalVariants((cur) => [...cur, variant]);
                  setNewVariantName("");
                  router.refresh();
                }}
              >
                Add
              </Button>
            </div>
            {variantError && <p className="mt-2 text-sm text-red-600">{variantError}</p>}
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="pattern">Pattern</Label>
          <Input
            id="pattern"
            value={form.pattern}
            onChange={(e) => setForm({ ...form, pattern: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          placeholder="https://images.unsplash.com/..."
        />
        <div className="mt-2">
          <Label htmlFor="imageUpload">Or upload from your device</Label>
          <Input
            id="imageUpload"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = String(reader.result ?? "");
                setForm((f) => ({ ...f, imageUrl: dataUrl }));
              };
              reader.readAsDataURL(file);
            }}
          />
          <p className="mt-2 text-xs text-slate-500">Uploaded images are stored as data URLs (local/dev only).</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="costPrice">Cost price (₹)</Label>
          <Input
            id="costPrice"
            type="number"
            min={0}
            value={form.costPrice}
            onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="sellingPrice">Selling price (₹)</Label>
          <Select
            id="sellingPrice"
            value={form.sellingPrice}
            onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })}
          >
            {PRICE_POINTS.map((p) => (
              <option key={p} value={p}>
                ₹{p}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="stockQuantity">Stock qty</Label>
          <Input
            id="stockQuantity"
            type="number"
            min={0}
            value={form.stockQuantity as any}
            onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
            placeholder=""
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="lowStockThreshold">Low stock alert at</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            min={1}
            value={form.lowStockThreshold}
            onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="tagCode">Tag code (optional)</Label>
          <Input
            id="tagCode"
            value={form.tagCode}
            onChange={(e) => setForm({ ...form, tagCode: e.target.value })}
            placeholder="Future: barcode / RFID"
            disabled
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : initial ? "Update saree" : "Add saree"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
