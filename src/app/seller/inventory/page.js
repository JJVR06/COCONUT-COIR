"use client";
import { useState, useEffect } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import { Plus, Trash2, Pencil, X } from "lucide-react";

export default function SellerInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    tag: "",
    description: "",
    image: "",
  });

  // Fetch products from DB on mount
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.products || []);
        setLoading(false);
      });
  }, []);

  const emptyForm = {
    name: "",
    price: "",
    stock: "",
    category: "",
    tag: "",
    description: "",
    image: "",
  };

  const startEdit = (item) => {
    setEditing(item.id);
    setAdding(false);
    setForm({
      name: item.name,
      price: item.price,
      stock: item.stock,
      category: item.category || "",
      tag: item.tag || "",
      description: item.description || "",
      image: item.image || "",
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const saveEdit = async () => {
    setSaving(true);
    const res = await fetch(`/api/products/${editing}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setItems((prev) =>
        prev.map((i) => (i.id === editing ? data.product : i))
      );
      setEditing(null);
      setForm(emptyForm);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addItem = async () => {
    if (!form.name || !form.price || !form.stock) {
      alert("Name, price, and stock are required.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        image:
          form.image ||
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setItems((prev) => [...prev, data.product]);
      setForm(emptyForm);
      setAdding(false);
    }
  };

  const formFields = [
    { key: "name", label: "Product Name", type: "text", placeholder: "e.g. Coir Door Mat", span: 2 },
    { key: "price", label: "Price (₱)", type: "number", placeholder: "e.g. 250" },
    { key: "stock", label: "Stock", type: "number", placeholder: "e.g. 40" },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: ["Home", "Garden", "Construction"],
    },
    {
      key: "tag",
      label: "Tag",
      type: "select",
      options: ["Best Seller", "Trending", "New", "Featured"],
    },
    { key: "image", label: "Image URL", type: "text", placeholder: "https://...", span: 2 },
    { key: "description", label: "Description", type: "text", placeholder: "Short description...", span: 2 },
  ];

  const renderField = (f) => (
    <div key={f.key} className={f.span === 2 ? "col-span-2" : ""}>
      <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
        {f.label}
      </label>
      {f.type === "select" ? (
        <select
          value={form[f.key]}
          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
        >
          <option value="">Select {f.label}</option>
          {f.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={f.type}
          value={form[f.key]}
          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
          placeholder={f.placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
        />
      )}
    </div>
  );

  const tagColors = {
    "Best Seller": "bg-yellow-100 text-yellow-700",
    Trending: "bg-blue-100 text-blue-700",
    New: "bg-green-100 text-green-700",
    Featured: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="flex min-h-screen">
      <SellerSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
            <p className="text-gray-500 text-sm mt-1">
              {items.length} product{items.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            onClick={() => { setAdding(!adding); setEditing(null); setForm(emptyForm); }}
            className="flex items-center gap-2 bg-[#2D5016] text-white px-5 py-2.5 rounded-xl hover:bg-[#1a3009] transition font-semibold text-sm"
          >
            {adding ? <X size={16} /> : <Plus size={16} />}
            {adding ? "Cancel" : "Add Product"}
          </button>
        </div>

        {/* Add Product Form */}
        {adding && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 border-[#2D5016] border-dashed">
            <h2 className="font-bold text-[#2D5016] mb-4 text-lg">New Product</h2>
            <div className="grid grid-cols-2 gap-4">
              {formFields.map(renderField)}
            </div>
            {form.image && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-1">Image Preview</p>
                <img
                  src={form.image}
                  alt="preview"
                  className="h-24 w-24 object-cover rounded-xl border"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
            <div className="flex gap-3 mt-5">
              <button
                onClick={addItem}
                disabled={saving}
                className="bg-[#2D5016] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a3009] transition disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Product"}
              </button>
              <button
                onClick={() => { setAdding(false); setForm(emptyForm); }}
                className="border border-gray-200 px-6 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Product Form */}
        {editing && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 border-blue-300 border-dashed">
            <h2 className="font-bold text-blue-700 mb-4 text-lg">Edit Product</h2>
            <div className="grid grid-cols-2 gap-4">
              {formFields.map(renderField)}
            </div>
            {form.image && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-1">Image Preview</p>
                <img
                  src={form.image}
                  alt="preview"
                  className="h-24 w-24 object-cover rounded-xl border"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
            <div className="flex gap-3 mt-5">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
              >
                {saving ? "Saving..." : "Update Product"}
              </button>
              <button
                onClick={cancelEdit}
                className="border border-gray-200 px-6 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-gray-400">Loading inventory...</div>
          ) : items.length === 0 ? (
            <div className="p-20 text-center text-gray-400">
              <p className="text-5xl mb-4">📦</p>
              <p>No products yet. Add your first product above.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 text-left text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Tag</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-t hover:bg-gray-50 transition ${
                      editing === item.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => (e.target.src = "https://placehold.co/48x48?text=No+Img")}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">
                        {item.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.category}</td>
                    <td className="px-4 py-3 font-bold text-[#2D5016]">
                      ₱{Number(item.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">{item.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      {item.tag && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tagColors[item.tag] || "bg-gray-100 text-gray-600"}`}>
                          {item.tag}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        item.stock === 0
                          ? "bg-red-100 text-red-600"
                          : item.stock < 20
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {item.stock === 0
                          ? "Out of Stock"
                          : item.stock < 20
                          ? "Low Stock"
                          : "In Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-blue-500 hover:text-blue-700 transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-400 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}