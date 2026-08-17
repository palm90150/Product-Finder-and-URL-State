import { filterProducts } from "@/lib/filter-products";
import { Product, products } from "@/data/products";
import Link from "next/link";

const PAGE_SIZE = 4;

type PageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const query = params.q ?? "";
  const category = params.category ?? "all";
  const sort =
    params.sort === "price-asc" || params.sort === "price-desc"
      ? params.sort
      : "name";

  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const filtered: Product[] = filterProducts(products, {
    query,
    category,
    sort,
    minPrice: minPrice && !isNaN(minPrice) ? minPrice : undefined,
    maxPrice: maxPrice && !isNaN(maxPrice) ? maxPrice : undefined,
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const rawPage = Number(params.page);
  const currentPage =
    isNaN(rawPage) || rawPage < 1
      ? 1
      : Math.min(rawPage, totalPages);

  const paginatedProducts = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const buildPageUrl = (pageNumber: number) => {
    const sp = new URLSearchParams();
    if (query) sp.set("q", query);
    if (category !== "all") sp.set("category", category);
    if (sort !== "name") sp.set("sort", sort);
    if (params.minPrice) sp.set("minPrice", params.minPrice);
    if (params.maxPrice) sp.set("maxPrice", params.maxPrice);
    sp.set("page", pageNumber.toString());

    return `/products?${sp.toString()}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-blue-400 transition"
          >
            <span>←</span> ย้อนกลับไปหน้าแรก
          </Link>
        </div>

        {/* Header & Badges Status */}
        <header className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-white mb-3">📦 รายการสินค้า (Products)</h1>
          
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              🔍 ค้นหา: <strong className="text-blue-400">{query || "ทั้งหมด"}</strong>
            </span>
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              🏷️ หมวดหมู่: <strong className="text-purple-400">{category}</strong>
            </span>
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              🔃 เรียงลำดับ: <strong className="text-emerald-400">{sort}</strong>
            </span>
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              💰 ราคา: <strong className="text-amber-400">{params.minPrice ?? "0"} - {params.maxPrice ?? "ไม่จำกัด"}</strong>
            </span>
          </div>
        </header>

        {/* Form Filter Bar */}
        <form method="GET" className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="ค้นหาชื่อสินค้า..."
            className="bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-slate-200 p-2.5 rounded-xl transition"
          />
          <input
            type="number"
            name="minPrice"
            defaultValue={params.minPrice ?? ""}
            placeholder="ราคาต่ำสุด"
            className="bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-slate-200 p-2.5 rounded-xl transition"
          />
          <input
            type="number"
            name="maxPrice"
            defaultValue={params.maxPrice ?? ""}
            placeholder="ราคาสูงสุด"
            className="bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-slate-200 p-2.5 rounded-xl transition"
          />
          <select
            name="sort"
            defaultValue={sort}
            className="bg-slate-950 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-slate-200 p-2.5 rounded-xl transition cursor-pointer"
          >
            <option value="name">ชื่อ (A-Z)</option>
            <option value="price-asc">ราคา (ต่ำ-สูง)</option>
            <option value="price-desc">ราคา (สูง-ต่ำ)</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm p-2.5 rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer"
          >
            กรองสินค้า
          </button>
        </form>

        {/* Product Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((item: Product) => (
              <div
                key={item.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition duration-200 flex flex-col justify-between hover:shadow-lg group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition">
                      {item.name}
                    </h3>
                    <span className="text-xs uppercase font-medium bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md border border-slate-700/50">
                      {item.category}
                    </span>
                  </div>
                  {item.owner && (
                    <p className="text-xs text-slate-500 mb-2">
                      เจ้าของ: {item.owner}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">ราคา</span>
                  <span className="text-xl font-bold text-emerald-400">
                    ฿{item.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              <p className="text-3xl mb-2">🔍</p>
              <p className="font-medium">ไม่พบสินค้าที่ตรงกับการค้นหา</p>
            </div>
          )}
        </section>

        {/* Pagination Footer */}
        <footer className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            แสดงหน้า <strong className="text-white">{currentPage}</strong> จากทั้งหมด{" "}
            <strong className="text-white">{totalPages}</strong> หน้า (รวม{" "}
            <strong className="text-blue-400">{totalItems}</strong> รายการ)
          </div>

          <div className="flex items-center gap-2">
            {currentPage <= 1 ? (
              <button
                disabled
                className="px-4 py-2 text-xs font-medium border border-slate-800 rounded-xl text-slate-600 bg-slate-950 cursor-not-allowed"
              >
                ← ก่อนหน้า
              </button>
            ) : (
              <Link
                href={buildPageUrl(currentPage - 1)}
                className="px-4 py-2 text-xs font-medium border border-slate-700 rounded-xl text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
              >
                ← ก่อนหน้า
              </Link>
            )}

            {currentPage >= totalPages ? (
              <button
                disabled
                className="px-4 py-2 text-xs font-medium border border-slate-800 rounded-xl text-slate-600 bg-slate-950 cursor-not-allowed"
              >
                ถัดไป →
              </button>
            ) : (
              <Link
                href={buildPageUrl(currentPage + 1)}
                className="px-4 py-2 text-xs font-medium border border-slate-700 rounded-xl text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
              >
                ถัดไป →
              </Link>
            )}
          </div>
        </footer>
      </div>
    </main>
  );
}