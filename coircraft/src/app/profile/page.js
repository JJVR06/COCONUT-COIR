"use client";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, setUser } = useApp();
  const router = useRouter();

  useEffect(() => { if (!user) router.push("/login"); }, [user]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fdf4] py-12 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-[#2D5016] mb-8">👤 My Profile</h1>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#2D5016] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "Address", value: user.address },
                { label: "Mobile", value: user.mobile },
              ].map(({ label, value }) => (
                <div key={label} className="border-b pb-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-gray-800 font-medium">{value}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setUser(null); router.push("/"); }}
              className="mt-8 w-full border-2 border-red-200 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}