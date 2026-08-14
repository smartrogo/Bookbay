import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useToast } from "../ToastContext";
import { fetchWishlist, removeFromWishlist, addToWishlist } from "../services/wishlistService";
import { addBookToCart } from "../services/bookService";
import { Footer } from "../components/Footer";

const formatPrice = (n) =>
  Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

const DEMO_WISHLIST = [
  {
    wishlist_id: 1,
    book_id: 1,
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    cover: "https://placehold.co/600x900/eef2ff/4f46e5?text=Things+Fall+Apart",
    priceBuy: 24.99,
    priceBorrow: 8.99,
    stock: 10,
    category: "Fiction",
  },
  {
    wishlist_id: 2,
    book_id: 3,
    title: "The Alchemist",
    author: "Paulo Coelho",
    cover: "https://placehold.co/600x900/eef2ff/4f46e5?text=The+Alchemist",
    priceBuy: 15.75,
    priceBorrow: 5.25,
    stock: 12,
    category: "Fiction",
  },
  {
    wishlist_id: 3,
    book_id: 5,
    title: "Clean Code",
    author: "Robert C. Martin",
    cover: "https://placehold.co/600x900/eef2ff/4f46e5?text=Clean+Code",
    priceBuy: 39.99,
    priceBorrow: 12.25,
    stock: 7,
    category: "Programming",
  },
];

const statusStyles = {
  active: "bg-emerald-100 text-emerald-700",
  outOfStock: "bg-red-100 text-red-700",
};

export const Wishlist = () => {
  const { userData, isAuth } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in?next=/wishlist");
      return;
    }
    loadWishlist();
  }, [isAuth, navigate, userData]);

  const loadWishlist = async () => {
    if (!userData?.id) return;

    setLoading(true);
    try {
      const response = await fetchWishlist();
      const data = response?.data || response;
      const items = data?.wishlist || data || [];
      setWishlist(Array.isArray(items) && items.length ? items : DEMO_WISHLIST);
    } catch (error) {
      console.warn("Wishlist endpoint unavailable — using demo data.", error);
      setWishlist(DEMO_WISHLIST);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (wishlistId) => {
    setRemovingId(wishlistId);
    try {
      await removeFromWishlist(wishlistId);
      setWishlist((current) => current.filter((item) => item.wishlist_id !== item.id && item.wishlist_id !== wishlistId));
      showToast("Removed from wishlist", { type: "success" });
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      showToast("Failed to remove from wishlist", { type: "error" });
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (bookId) => {
    if (!isAuth) {
      navigate("/sign-in?next=/wishlist");
      return;
    }

    setAddingToCart(bookId);
    try {
      await addBookToCart(userData.id, { book_id: bookId, quantity: 1 });
      showToast("Added to cart!", { type: "success" });
    } catch (error) {
      console.error("Add to cart error:", error);
      showToast("Failed to add to cart", { type: "error" });
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#312e81] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-200 hover:text-white text-[0.85rem] mb-4 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">❤️</span>
            <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
          </div>
          <p className="text-indigo-200">Books you've saved for later</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{wishlist.length}</p>
            <p className="text-[0.8rem] text-slate-500">Saved Books</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {formatPrice(
                wishlist.reduce((sum, item) => sum + (item.priceBuy || 0), 0)
              )}
            </p>
            <p className="text-[0.8rem] text-slate-500">Total Value</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center col-span-2 md:col-span-1">
            <p className="text-2xl font-bold text-amber-600">
              {wishlist.filter((item) => (item.stock || 0) > 0).length}
            </p>
            <p className="text-[0.8rem] text-slate-500">In Stock</p>
          </div>
        </div>

        {/* Wishlist Items */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-32 bg-slate-200 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h3>
            <p className="text-slate-500 mb-6">
              Save books you're interested in and come back later.
            </p>
            <Link
              to="/buy"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item) => {
              const bookId = item.book_id || item.id;
              const isOutOfStock = (item.stock || 0) === 0;
              const isInCart = false;

              return (
                <div
                  key={item.wishlist_id || bookId}
                  className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Book Cover */}
                    <Link to={`/books/${bookId}`} className="shrink-0">
                      <img
                        src={item.cover || item.coverPic || `https://placehold.co/300x450/eef2ff/4f46e5?text=${encodeURIComponent(item.title)}`}
                        alt={item.title}
                        className="w-24 h-32 sm:w-28 sm:h-40 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/300x450/eef2ff/4f46e5?text=${encodeURIComponent(item.title)}`;
                        }}
                      />
                    </Link>

                    {/* Book Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <Link
                            to={`/books/${bookId}`}
                            className="text-lg font-semibold text-slate-900 hover:text-indigo-600 transition line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <p className="text-slate-500 text-[0.9rem]">{item.author}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[0.75rem] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                              {item.category || "General"}
                            </span>
                            <span
                              className={`text-[0.75rem] px-2 py-0.5 rounded-full ${
                                isOutOfStock ? statusStyles.outOfStock : statusStyles.active
                              }`}
                            >
                              {isOutOfStock ? "Out of Stock" : "In Stock"}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[0.7rem] text-slate-400 uppercase tracking-wide mb-1">Buy</p>
                          <p className="text-xl font-bold text-indigo-600">
                            {formatPrice(item.priceBuy)}
                          </p>
                          <p className="text-[0.7rem] text-slate-400 uppercase tracking-wide mt-2 mb-1">Borrow</p>
                          <p className="text-[0.9rem] font-semibold text-emerald-600">
                            {formatPrice(item.priceBorrow)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          onClick={() => handleAddToCart(bookId)}
                          disabled={isOutOfStock || addingToCart === bookId}
                          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-[0.85rem] font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingToCart === bookId ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M5.6 14A8 8 0 0118.4 10M18.4 10A8 8 0 015.6 14" />
                              </svg>
                              Adding...
                            </>
                          ) : (
                            <>
                              🛒 Add to Cart
                            </>
                          )}
                        </button>

                        <Link
                          to={`/books/${bookId}`}
                          className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-[0.85rem] font-semibold hover:bg-slate-200 transition text-center"
                        >
                          View Details
                        </Link>

                        <button
                          onClick={() => handleRemove(item.wishlist_id || bookId)}
                          disabled={removingId === (item.wishlist_id || bookId)}
                          className="bg-rose-50 text-rose-600 px-4 py-2 rounded-lg text-[0.85rem] font-semibold hover:bg-rose-100 transition disabled:opacity-50"
                        >
                          {removingId === (item.wishlist_id || bookId) ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        {wishlist.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/buy"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-center"
            >
              Continue Shopping
            </Link>
            <Link
              to="/cart"
              className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition text-center"
            >
              Go to Cart
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
