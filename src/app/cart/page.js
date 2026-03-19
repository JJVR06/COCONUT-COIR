"use client";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQty } = useApp();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fdf4] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#2D5016] mb-8">🛒 Your Cart</h1>
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl mb-4">Your cart is empty.</p>
              <Link href="/products" className="bg-[#2D5016] text-white px-6 py-3 rounded-full hover:bg-[#1a3009] transition">
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-[#2D5016] font-bold">₱{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeFromCart(item.id)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-bold text-gray-700 w-24 text-right">
                    ₱{(item.price * item.qty).toLocaleString()}
                  </p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total</p>
                  <p className="text-3xl font-black text-[#2D5016]">₱{total.toLocaleString()}</p>
                </div>
                <Link href="/checkout"
                  className="bg-[#2D5016] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1a3009] transition">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}