"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VariantItem({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!confirm(`Delete variant "${name}"? This cannot be undone.`)) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/variants/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Delete failed");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch (err) {
      setError("Delete failed");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between">
      <span>{name}</span>
      <div className="flex items-center gap-2">
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button variant="outline" onClick={handleDelete} disabled={loading}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
