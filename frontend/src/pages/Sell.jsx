import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ToastContext";
import { apiClient } from "../services/api";
import { Footer } from "../components/Footer";

const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Self-Help",
  "Programming",
  "Science",
  "History",
  "Biography",
  "Business",
  "Religious",
  "Computer",
  "Adventures",
  "Children/Adult",
  "Science/Technology",
  "Business/Economics",
  "Art & Photography",
  "Spirituality",
  "Education & Teaching",
  "Health & Wellness",
  "Philosophy",
  "Parenting & Family",
];

export const Sell = () => {
  const { userData, isAuth } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    category_id: "",
    price_buy: "",
    price_borrow: "",
    stock: "1",
    year: "",
    cover_pic: "",
  });

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in?next=/sell");
      return;
    }
    loadCategories();
  }, [isAuth, navigate]);

  const loadCategories = async () => {
    try {
      const response = await apiClient.get("/categories");
      const data = response.data;
      const cats = data?.categories || data?.data || data || [];
      setCategories(Array.isArray(cats) && cats.length ? cats : []);
    } catch (error) {
      console.warn("Categories endpoint unavailable.", error);
      setCategories(
        CATEGORIES.map((name, i) => ({
          id: i + 1,
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        }))
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.author.trim()) {
      showToast("Title and author are required", { type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        description: form.description.trim(),
        category_id: form.category_id ? Number(form.category_id) : undefined,
        priceBuy: form.price_buy ? Number(form.price_buy) : undefined,
        priceBorrow: form.price_borrow ? Number(form.price_borrow) : undefined,
        stock: form.stock ? Number(form.stock) : 1,
        year: form.year.trim(),
        coverPic: form.cover_pic.trim() || undefined,
        cover: form.cover_pic.trim() || undefined,
      };

      await apiClient.post("/books", payload);
      showToast("Book listed successfully!", { type: "success" });
      navigate("/my-books");
    } catch (error) {
      console.error("Error listing book:", error);
      showToast(error?.message || "Failed to list book. Please try again.", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#312e81] py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-200 hover:text-white text-[0.85rem] mb-4 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Sell a Book</h1>
          <p className="text-indigo-200">
            List your book on BookBay and reach thousands of readers
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Book Details</h2>
            <p className="text-[0.85rem] text-slate-500">
              Fill in the information about your book
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Title & Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[0.85rem] font-medium text-slate-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[0.85rem] font-medium text-slate-700 mb-2">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[0.85rem] font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your book (condition, edition, etc.)"
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[0.85rem] font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[0.85rem] font-medium text-slate-700 mb-2">
                  Buy Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    name="price_buy"
                    value={form.price_buy}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[0.85rem] font-medium text-slate-700 mb-2">
                  Borrow Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    name="price_borrow"
                    value={form.price_borrow}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Stock & Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[0.85rem] font-medium text-slate-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-[0.85rem] font-medium text-slate-700 mb-2">
                  Publication Year
                </label>
                <input
                  type="text"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="e.g. 2024"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-[0.85rem] font-medium text-slate-700 mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                name="cover_pic"
                value={form.cover_pic}
                onChange={handleChange}
                placeholder="https://example.com/book-cover.jpg"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-[0.75rem] text-slate-400 mt-1">
                Optional. Paste a URL to your book cover image.
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-lg bg-indigo-600 text-white text-[0.9rem] font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M5.6 14A8 8 0 0118.4 10M18.4 10A8 8 0 015.6 14" />
                  </svg>
                  Listing...
                </>
              ) : (
                "List Book for Sale"
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};
