"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { LayoutDashboard, Package, BarChart2, Store, LogOut } from "lucide-react";

const links = [
  { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/storefront", label: "Storefront", icon: Store },
  { href: "/seller/inventory", label: "Inventory", icon: Package },
  { href: "/seller/reports", label: "Reports", icon: BarChart2 },
];

export default function SellerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setSellerLoggedIn } = useApp();

  const logout = () => {
    setSellerLoggedIn(false);
    router.push("/seller/login");
  };

  return (
    <aside className="w-56 bg-[#1a3009] text-white min-h-screen flex flex-col py-6 px-4">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-2xl">🥥</span>
        <span className="font-bold text-[#C8E6A0]">CoirCraft Seller</span>
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
              pathname === href ? "bg-[#2D5016] text-white" : "hover:bg-[#2D5016] text-green-300"
            }`}
          >
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm mt-4"
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
}