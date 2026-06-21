"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function VariantForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Variant name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Unable to create variant");
        setLoading(false);
        return;
      }

      setName("");
      router.refresh();
    } catch {
      setError("Unable to reach server. Try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="variantName">Variant name</Label>
        <Input
          id="variantName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Banaras"
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Adding…" : "Add variant"}
      </Button>
    </form>
  );
}
