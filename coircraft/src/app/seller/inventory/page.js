"use client";
import { useState } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import { products as initial } from "@/data/products";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function SellerInventory() {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "", tag: "", description: "" });
  const [adding, setAdding] = useState(false);

  const startEdit = (item) => {
    setEditing(item.id);
    setForm({ name: item.name, price: item.price, stock: item.stock, category: item.category, tag: item.tag, description: item.description });
  };

  const saveEdit = () => {
    setItems((prev) => prev.map((i) =>
      i.id === editing ? { ...i, ...form, price: Number(form.price), stock: Number(form.stock) } : i
    ));
    setEditing(null);
  };

  const deleteItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const addItem = () => {
    setItems((prev) => [...prev, { ...form, id: Date.now(), price: Number(form.price), stock: Number(form.stock), image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" }]);
    setForm({ name: "", price: "", stock: "", category: "", tag: "", description: "" });
    setAdding(false);
  };

  return (
    <div className="flex min-h-screen">
      <SellerSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
          <button onClick={() => setAdding(!adding)}
            className="flex items-center gap-2 bg-[#2D5016] text-white px-4 py-2 rounded-xl hover:bg-[#1a3009] transition">
            <Plus size={16} /> Add Product
          </button>
        </div>

        {adding && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 grid grid-cols-2 gap-4">
            {["name", "price", "stock", "category", "tag", "description"].map((f) => (
              <div key={f}>
                <label className="text-xs text-gray-500 capitalize">{f}</label>
                <input value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]" />
              </div>
            ))}
            <div className="col-span-2 flex gap-3">
              <button onClick={addItem} className="bg-[#2D5016] text-white px-6 py-2 rounded-lg text-sm">Save</button>
              <button onClick={() => setAdding(false)} className="border px-6 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-400 text-left">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Tag</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  {editing === item.id ? (
                    <>
                      <td className="px-4 py-3"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded px-2 py-1 w-full text-xs" /></td>
                      <td className="px-4 py-3"><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border rounded px-2 py-1 w-24 text-xs" /></td>
                      <td className="px-4 py-3"><input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border rounded px-2 py-1 w-20 text-xs" /></td>
                      <td className="px-4 py-3"><input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border rounded px-2 py-1 w-16 text-xs" /></td>
                      <td className="px-4 py-3"><input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="border rounded px-2 py-1 w-24 text-xs" /></td>
                      <td className="px-4 py-3">
                        <button onClick={saveEdit} className="text-green-600 font-semibold text-xs mr-2">Save</button>
                        <button onClick={() => setEditing(null)} className="text-gray-400 text-xs">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium text-gray-700">{item.name}</td>
                      <td className="px-4 py-3 text-gray-500">{item.category}</td>
                      <td className="px-4 py-3 text-[#2D5016] font-semibold">₱{Number(item.price).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.stock < 20 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{item.tag}</td>
                      <td className="px-4 py-3 flex gap-3">
                        <button onClick={() => startEdit(item)} className="text-blue-500 hover:text-blue-700"><Pencil size={15} /></button>
                        <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}