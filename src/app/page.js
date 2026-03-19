import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="relative min-h-[90vh] flex items-center justify-center text-white text-center"
          style={{ background: "linear-gradient(135deg, #1a3009 0%, #2D5016 50%, #4a7c28 100%)" }}
        >
          <div className="z-10 px-4">
            <div className="text-6xl mb-4">🥥</div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
              CoirCraft <span className="text-[#C8E6A0]">PH</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-200 max-w-xl mx-auto mb-8">
              Eco-friendly coconut coir products — sustainably crafted in the Philippines
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/store"
                className="bg-[#C8E6A0] text-[#1a3009] px-8 py-3 rounded-full font-bold text-lg hover:bg-white transition"
              >
                Shop Now
              </Link>
              <Link
                href="/products"
                className="border-2 border-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-[#1a3009] transition"
              >
                View Products
              </Link>
            </div>
          </div>
        </section>

        {/* Why CoirCraft */}
        <section className="py-20 bg-[#f9fdf4]">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-[#2D5016] mb-12">Why Choose CoirCraft?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "🌿", title: "100% Natural", desc: "Made from real coconut coir fibers — no synthetic materials." },
                { icon: "♻️", title: "Eco-Friendly", desc: "Biodegradable and sustainable. Good for you and the planet." },
                { icon: "🇵🇭", title: "Made in PH", desc: "Supporting local Filipino farmers and communities." },
              ].map((f) => (
                <div key={f.title} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition">
                  <div className="text-5xl mb-4">{f.icon}</div>
                  <h3 className="text-xl font-bold text-[#2D5016] mb-2">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-[#2D5016] mb-12">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Home", emoji: "🏠", bg: "bg-amber-50" },
                { label: "Garden", emoji: "🌱", bg: "bg-green-50" },
                { label: "Construction", emoji: "🏗️", bg: "bg-stone-50" },
              ].map((c) => (
                <Link
                  key={c.label}
                  href={`/products?category=${c.label}`}
                  className={`${c.bg} rounded-2xl p-10 text-center hover:shadow-lg transition group`}
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform inline-block">{c.emoji}</div>
                  <h3 className="text-xl font-bold text-[#2D5016]">{c.label}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}