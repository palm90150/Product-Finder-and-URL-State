export type Product = {
  id: number;
  name: string;
  category: "office" | "tech" | "lifestyle";
  price: number;
  owner?: string;
};
export const products: Product[] = [
  { id: 1, name: "Standing Desk", category: "office", price: 299.99 },
];