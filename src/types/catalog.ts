export type Scale = { min: number; price: number };

export type Product = {
  id: string;
  category: string;
  name: string;
  image: string;
  retailARS: number;
  scales: Scale[];
  stockInfo: string;
  description?: string;
};

export type CartItem = {
  productId: string;
  qty: number;
  note: string;
};

export type PriceTier = {
  unitUSD: number | null;
  unitARS: number;
  isWholesale: boolean;
  scale: Scale | null;
};
