import { Product } from "@/data/products";

export type ProductFilter = {
  query: string;
  category: string;
  sort: "name" | "price-asc" | "price-desc";
  minPrice?: number;
  maxPrice?: number;
};

export function filterProducts(
  products: Product[],
  filter: ProductFilter
): Product[] {
  const { query, category, sort, minPrice, maxPrice } = filter;
  const keyword = query.trim().toLowerCase();

  // ฟังก์ชันย่อยสำหรับเช็กเงื่อนไขการกรอง
  const isMatch = (product: Product) => {
    const matchQuery = product.name.toLowerCase().includes(keyword);
    const matchCategory =
      category === "all" || category === "" || product.category === category;
    const matchMinPrice =
      minPrice === undefined || isNaN(minPrice) || product.price >= minPrice;
    const matchMaxPrice =
      maxPrice === undefined || isNaN(maxPrice) || product.price <= maxPrice;

    return matchQuery && matchCategory && matchMinPrice && matchMaxPrice;
  };

  // ฟังก์ชันย่อยสำหรับการเรียงลำดับ
  const sortComparator = (a: Product, b: Product) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return a.name.localeCompare(b.name);
    }
  };

  return products.filter(isMatch).sort(sortComparator);
}