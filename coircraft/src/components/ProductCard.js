"use client";
import { useApp } from "@/context/AppContext";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const { addToCart, user } = useApp();
  const router = useRouter();

  const tagColors = {
    "Best Seller": "bg-yellow-400 text-yellow-900",
    "Trending": "bg-blue-400 text-blue-900",
    "New": "bg-green-400 text-green-900",
    "Featured": "bg-purple-400 text-purple-900",
  };

  const handleAdd = () => {
    if (!user) { router.push("/login"); return; }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative overflow-hidden h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.tag && (
          <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full ${tagColors[product.tag] || "bg-gray-200"}`}>
            {product.tag}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-1 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[#2D5016] font-bold text-lg">₱{product.price.toLocaleString()}</span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 bg-[#2D5016] text-white px-3 py-1.5 rounded-full text-xs hover:bg-[#3d6b1e] transition"
          >
            <ShoppingCart size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}