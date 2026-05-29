import { prisma } from "./db";

export async function nextReceiptNo(prefix: "PUR" | "SAL") {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, "");
  const pattern = `${prefix}-${datePart}-`;

  const latest =
    prefix === "PUR"
      ? await prisma.purchaseReceipt.findFirst({
          where: { receiptNo: { startsWith: pattern } },
          orderBy: { receiptNo: "desc" },
        })
      : await prisma.salesReceipt.findFirst({
          where: { receiptNo: { startsWith: pattern } },
          orderBy: { receiptNo: "desc" },
        });

  let seq = 1;
  if (latest) {
    const parts = latest.receiptNo.split("-");
    const lastSeq = parseInt(parts[parts.length - 1] ?? "0", 10);
    if (!Number.isNaN(lastSeq)) seq = lastSeq + 1;
  }

  return `${pattern}${String(seq).padStart(3, "0")}`;
}
