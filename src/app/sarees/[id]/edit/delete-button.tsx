"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteSareeButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/sarees/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/sarees");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error ?? "Delete failed");
    }
  }

  return (
    <Button variant="danger" onClick={handleDelete}>
      <Trash2 className="h-4 w-4" />
      Delete
    </Button>
  );
}
