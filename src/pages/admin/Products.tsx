import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, Loader, LogOut, ArrowLeft, Upload, X, ImagePlus, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";
import { formatKSH } from "../../lib/currency";
import { categories } from "../../types/product";
import { useAdminAuth } from "../../context/AdminAuthContext";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  category: string;
  gender: string;
  images: string[];
  description?: string;
  sizes?: string[];
  colors?: string[];
  stock: number;
  rating: number;
  reviews: number;
  featured?: boolean;
  new_arrival?: boolean;
}

const emptyForm = {
  name: "",
  category: "Dresses",
  gender: "Womens",
  price: "",
  original_price: "",
  stock: "",
  description: "",
  sizes: "",
  colors: "",
  featured: false,
  new_arrival: false,
};

const BUCKET = "product-images";

export default function Products() {
  const { signOut } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Image state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // final URLs saved to product
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setUploadedImages([]);
    setUrlInput("");
    setUploadError(null);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category || "Dresses",
      gender: product.gender,
      price: product.price.toString(),
      original_price: product.original_price ? product.original_price.toString() : "",
      stock: product.stock.toString(),
      description: product.description || "",
      sizes: product.sizes?.join(", ") || "",
      colors: product.colors?.join(", ") || "",
      featured: !!product.featured,
      new_arrival: !!product.new_arrival,
    });
    setUploadedImages(product.images || []);
    setUrlInput("");
    setUploadError(null);
    setShowModal(true);
  };

  // ── Upload files to Supabase Storage ──────────────────────────────────────
  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    const allowed = arr.filter((f) => f.type.startsWith("image/"));
    if (!allowed.length) { setUploadError("Please select image files (JPG, PNG, WEBP)."); return; }

    setUploading(true);
    setUploadError(null);
    const newUrls: string[] = [];

    for (const file of allowed) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (upErr) {
        setUploadError(`Upload failed: ${upErr.message}. Make sure you created a "product-images" bucket in Supabase Storage.`);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }

    setUploadedImages((prev) => [...prev, ...newUrls]);
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith("http")) { setUploadError("Please enter a valid URL starting with http."); return; }
    setUploadedImages((prev) => [...prev, url]);
    setUrlInput("");
    setUploadError(null);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Save product ───────────────────────────────────────────────────────────
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length === 0) { setUploadError("Please add at least one image."); return; }
    setError(null);
    setSaving(true);
    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        gender: formData.gender,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        stock: parseInt(formData.stock || "0", 10),
        images: uploadedImages,
        description: formData.description,
        sizes: formData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: formData.colors.split(",").map((s) => s.trim()).filter(Boolean),
        featured: formData.featured,
        new_arrival: formData.new_arrival,
        rating: 4.5,
        reviews: 0,
      };

      if (editingId) {
        const { error } = await supabase.from("products").update(productData).eq("id", editingId);
        if (error) throw error;
        setProducts(products.map((p) => (p.id === editingId ? { ...p, ...productData } : p)));
      } else {
        const { data, error } = await supabase.from("products").insert([productData]).select();
        if (error) throw error;
        if (data) setProducts([data[0], ...products]);
      }
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="bg-blush-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-plum-700 mb-3">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-ink">Product Management</h1>
                <p className="text-gray-600 mt-2">Add, edit, or delete products — upload images directly from your computer</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={openAddModal}
                  className="px-6 py-3 bg-plum-700 text-white rounded-lg font-semibold hover:bg-plum-800 transition flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" /> Add Product
                </button>
                <button onClick={signOut} title="Sign out" className="px-4 py-3 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500"
              />
            </div>
          </motion.div>

          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">{error}</div>}

          {/* Products table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow-sm overflow-hidden overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12"><Loader className="h-6 w-6 text-plum-600 animate-spin" /></div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No products yet. Click "Add Product" to create your first listing.</div>
            ) : (
              <table className="w-full min-w-[640px]">
                <thead className="bg-blush-50 border-b border-blush-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-ink">Product</th>
                    <th className="text-left py-4 px-6 font-semibold text-ink">Category</th>
                    <th className="text-left py-4 px-6 font-semibold text-ink">Price</th>
                    <th className="text-left py-4 px-6 font-semibold text-ink">Stock</th>
                    <th className="text-left py-4 px-6 font-semibold text-ink">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-blush-50/50 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          ) : (
                            <div className="w-12 h-12 bg-blush-100 rounded flex items-center justify-center">
                              <ImagePlus className="h-5 w-5 text-blush-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-ink">{product.name}</p>
                            <div className="flex gap-1 mt-1">
                              {product.featured && <span className="text-[10px] bg-plum-100 text-plum-700 px-2 py-0.5 rounded-full font-medium">Featured</span>}
                              {product.new_arrival && <span className="text-[10px] bg-rosegold-100 text-rosegold-700 px-2 py-0.5 rounded-full font-medium">New</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{product.category}</td>
                      <td className="py-4 px-6 font-semibold text-ink">{formatKSH(product.price)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 20 ? "bg-green-100 text-green-800" :
                          product.stock > 10 ? "bg-yellow-100 text-yellow-800" :
                          product.stock > 0 ? "bg-orange-100 text-orange-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {product.stock > 0 ? product.stock : "Out of stock"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(product)} className="p-2 text-plum-600 hover:bg-plum-50 rounded transition" title="Edit"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleDeleteProduct(product.id, product.name)} className="p-2 text-red-600 hover:bg-red-50 rounded transition" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>

          {/* ── Modal ── */}
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[92vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-blush-100">
                  <h2 className="text-2xl font-display font-bold text-ink">
                    {editingId ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-blush-50 rounded-lg transition">
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="px-8 py-6 space-y-5">

                  {/* ── IMAGE UPLOAD SECTION ── */}
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-3">Product Images</label>

                    {/* Image previews */}
                    {uploadedImages.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-3">
                        {uploadedImages.map((url, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={url}
                              alt={`Product image ${i + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border-2 border-blush-200"
                            />
                            {i === 0 && (
                              <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-plum-700 text-white py-0.5 rounded-b-lg">
                                Main
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Drop zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                        isDragging
                          ? "border-plum-500 bg-blush-100"
                          : "border-blush-300 hover:border-plum-400 hover:bg-blush-50"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader className="h-7 w-7 text-plum-600 animate-spin" />
                          <p className="text-sm text-plum-700 font-medium">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-blush-100 rounded-full flex items-center justify-center">
                            <Upload className="h-6 w-6 text-plum-600" />
                          </div>
                          <p className="text-sm font-semibold text-ink">
                            Click to upload or drag & drop
                          </p>
                          <p className="text-xs text-gray-500">JPG, PNG, WEBP — multiple files supported</p>
                        </div>
                      )}
                    </div>

                    {/* URL fallback */}
                    <div className="flex gap-2 mt-3">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Or paste an image URL..."
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddUrl}
                        className="px-4 py-2 bg-blush-100 text-plum-700 rounded-lg text-sm font-semibold hover:bg-blush-200 transition"
                      >
                        Add
                      </button>
                    </div>

                    {uploadError && (
                      <p className="text-xs text-red-600 mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {uploadError}
                      </p>
                    )}
                  </div>

                  {/* ── PRODUCT DETAILS ── */}
                  <div className="border-t border-blush-100 pt-5 space-y-3">
                    <input
                      type="text"
                      placeholder="Product name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 text-sm"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 text-sm"
                      >
                        {categories.filter((c) => c !== "All").map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 text-sm"
                      >
                        <option>Womens</option>
                        <option>Kids</option>
                        <option>Unisex</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Price (Ksh)"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required min="0" step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Was-price (optional)"
                        value={formData.original_price}
                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                        min="0" step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 text-sm"
                      />
                    </div>

                    <input
                      type="number"
                      placeholder="Stock quantity"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 text-sm"
                    />

                    <textarea
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 text-sm"
                    />

                    <input
                      type="text"
                      placeholder="Sizes (comma-separated, e.g: S, M, L, XL)"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 text-sm"
                    />

                    <input
                      type="text"
                      placeholder="Colors (comma-separated, e.g: Black, Wine, Emerald)"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-500 text-sm"
                    />

                    <div className="flex gap-6 pt-1">
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="rounded accent-plum-700" />
                        Featured on homepage
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={formData.new_arrival} onChange={(e) => setFormData({ ...formData, new_arrival: e.target.checked })} className="rounded accent-plum-700" />
                        New Arrival
                      </label>
                    </div>
                  </div>

                  {/* ── Actions ── */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving || uploading}
                      className="flex-1 px-4 py-3 bg-plum-700 text-white rounded-lg font-semibold hover:bg-plum-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {saving && <Loader className="h-4 w-4 animate-spin" />}
                      {saving ? "Saving..." : editingId ? "Save Changes" : "Add Product"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
}