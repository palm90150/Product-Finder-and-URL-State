import Link from "next/link";

const CATEGORY_LINKS = [
  { label: "หมวด Office", category: "office", icon: "🏢" },
  { label: "หมวด Tech", category: "tech", icon: "💻" },
  { label: "หมวด Lifestyle", category: "lifestyle", icon: "☕" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-purple-600/10 pointer-events-none" />

      <section className="relative z-10 max-w-lg w-full text-center bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full">
          ✨ Welcome to Product Finder
        </span>
        
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
          Product Finder App
        </h1>
        
        <p className="text-slate-400 mb-8 text-sm leading-relaxed">
          ค้นหา กรองสินค้า ตามช่วงราคา หมวดหมู่ และแบ่งหน้าได้อย่างสะดวกสะดวกรวดเร็ว
        </p>

        {/* ปุ่มหลักเข้าสู่หน้ารายการสินค้า */}
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5"
        >
          <span>ดูรายการสินค้าทั้งหมด</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>

        {/* ทางลัดค้นหาตามหมวดหมู่ */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 font-medium mb-3">หมวดหมู่ยอดนิยม</p>
          <nav className="flex flex-wrap justify-center gap-2">
            {CATEGORY_LINKS.map((item) => (
              <Link
                key={item.category}
                href={`/products?category=${item.category}`}
                className="flex items-center gap-1.5 text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 px-3.5 py-2 rounded-lg transition-all"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}