export type VariantCategory = {
  id: string;
  name: string;
  _count?: { sarees: number };
};

export type Saree = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  variantId: string;
  variant: VariantCategory;
  color: string | null;
  pattern: string | null;
  imageUrl: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  tagCode: string | null;
};

export type LineItem = {
  sareeId: string;
  quantity: number;
  unitCost?: number;
  unitPrice?: number;
};

export type PurchaseReceipt = {
  id: string;
  receiptNo: string;
  vendorName: string;
  vendorPhone: string | null;
  notes: string | null;
  totalAmount: number;
  createdAt: string | Date;
  items: {
    id: string;
    quantity: number;
    unitCost: number;
    lineTotal: number;
    saree: Saree;
  }[];
};

export type SalesReceipt = {
  id: string;
  receiptNo: string;
  customerName: string | null;
  customerPhone: string | null;
  notes: string | null;
  totalAmount: number;
  discount: number;
  createdAt: string | Date;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    saree: Saree;
  }[];
};

export type DashboardData = {
  sareeCount: number;
  variantCount: number;
  totalStock: number;
  stockValue: number;
  lowStockCount: number;
  lowStockItems: Saree[];
  salesTotal: number;
  salesCount: number;
  purchaseTotal: number;
  purchaseCount: number;
  recentSales: SalesReceipt[];
  recentPurchases: PurchaseReceipt[];
};
