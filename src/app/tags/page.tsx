import { QrCode, ScanLine, Tag } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TagsPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#1a0f0f]">Tags & Barcodes</h1>
        <p className="mt-1 text-[#6b5a5a]">Future enhancement — planned for a later release</p>
      </header>

      <Card className="border-dashed border-2 border-[#c9a227]/40 bg-gradient-to-br from-[#fff9f5] to-[#f5ebe0]">
        <CardHeader
          title="Coming soon"
          subtitle="Scan or create tags for saree inventory"
          action={<Badge variant="warning">Planned</Badge>}
        />
        <CardBody className="space-y-6">
          <p className="text-[#4a3535]">
            This section will support barcode/QR scanning and printable shelf tags linked to each
            saree SKU. For now, use SKU codes on receipts and the catalog.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: ScanLine, title: "Scan tags", desc: "Camera or USB scanner input" },
              { icon: Tag, title: "Create tags", desc: "Generate labels per saree variant" },
              { icon: QrCode, title: "Print tags", desc: "Batch print for new stock" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-[#e8d5c4]/60 bg-white/60 p-5 opacity-60"
                >
                  <Icon className="mb-3 h-8 w-8 text-[#7a1f2e]" />
                  <h3 className="font-semibold text-[#1a0f0f]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[#6b5a5a]">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
