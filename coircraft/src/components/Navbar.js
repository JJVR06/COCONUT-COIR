"use client";
import Link from "next/link";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, setUser, cart } = useApp();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const logout = () => {
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-[#2D5016] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-3xl">🥥</span>
          <span className="text-[#C8E6A0]">CoirCraft</span>
          <span className="text-xs text-green-300 font-normal">PH</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-[#C8E6A0] transition">Home</Link>
          <Link href="/store" className="hover:text-[#C8E6A0] transition">Store</Link>
          <Link href="/products" className="hover:text-[#C8E6A0] transition">Products</Link>
          {user ? (
            <>
              <Link href="/cart" className="relative hover:text-[#C8E6A0]">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="hover:text-[#C8E6A0]"><User size={20} /></Link>
              <button onClick={logout} className="hover:text-red-300 transition"><LogOut size={20} /></button>
            </>
          ) : (
            <>
              <Link href="/login" className="bg-[#C8E6A0] text-[#2D5016] px-4 py-1.5 rounded-full font-semibold hover:bg-white transition">
                Login
              </Link>
              <Link href="/register" className="border border-[#C8E6A0] px-4 py-1.5 rounded-full hover:bg-[#C8E6A0] hover:text-[#2D5016] transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#1a3009] px-4 py-4 flex flex-col gap-3 text-sm">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/store" onClick={() => setOpen(false)}>Store</Link>
          <Link href="/products" onClick={() => setOpen(false)}>Products</Link>
          {user ? (
            <>
              <Link href="/cart" onClick={() => setOpen(false)}>Cart ({cartCount})</Link>
              <Link href="/profile" onClick={() => setOpen(false)}>Profile</Link>
              <button onClick={logout} className="text-left text-red-300">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link href="/register" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}