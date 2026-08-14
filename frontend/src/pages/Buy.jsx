import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useToast } from "../ToastContext";
import { fetchAllBooks, searchBooks, fetchBooksByCategory, addBookToCart } from "../services/bookService";
import { Footer } from "../components/Footer";

const CATEGORIES = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Self-Help",
  "Programming",
  "Science",
  "History",
  "Biography",
  "Business",
];

const formatPrice = (n) =>
  Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

const BookCard = ({ book, onAddToCart, isAuth }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        <img
          src={book.cover || book.coverPic}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = `https://placehold.co/600x900/eef2ff/4f46e5?text=${encodeURIComponent(book.title)}`;
          }}
        />
        {book.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs px-2 py-1 rounded-full font-medium">
            {book.category || "General"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <Link to={`/books/${book.id}`} className="block">
          <h3 className="font-semibold text-slate-900 text-[0.95rem] line-clamp-1 hover:text-indigo-600 transition">
            {book.title}
          </h3>
          <p className="text-slate-500 text-[0.8rem] mt-0.5">{book.author}</p>
        </Link>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-[0.7rem] text-slate-400 uppercase tracking-wide">Buy</p>
            <p className="text-indigo-600 font-bold text-[1.1rem]">{formatPrice(book.priceBuy)}</p>
          </div>
          <div className="text-right">
            <p className="text-[0.7rem] text-slate-400 uppercase tracking-wide">Borrow</p>
            <p className="text-emerald-600 font-semibold text-[0.9rem]">{formatPrice(book.priceBorrow)}</p>
          </div>
        </div>

        {/* Stock Status */}
        <div className="mt-2 flex items-center gap-2 text-[0.75rem]">
          {book.stock === 0 ? (
            <span className="text-red-500 font-medium">Out of stock</span>
          ) : book.stock <= 3 ? (
            <span className="text-amber-600 font-medium">⚠️ Only {book.stock} left!</span>
          ) : (
            <span className="text-emerald-600">✓ In stock ({book.stock})</span>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => {
              if (!isAuth) {
                navigate("/sign-in?next=/buy");
                return;
              }
              onAddToCart(book.id, "priceBuy");
            }}
            disabled={book.stock === 0}
            className="flex-1 bg-indigo-600 text-white text-[0.8rem] font-semibold py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
          <Link
            to={`/books/${book.id}`}
            className="flex-1 bg-slate-100 text-slate-700 text-[0.8rem] font-semibold py-2 rounded-lg hover:bg-slate-200 transition text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export const Buy = () => {
  const { userData, isAuth } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const result = await fetchAllBooks();
      setBooks(result.books || []);
    } catch (error) {
      console.error("Error loading books:", error);
      showToast("Failed to load books", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadBooks();
      return;
    }

    setLoading(true);
    try {
      const result = await searchBooks(searchQuery);
      setBooks(result.books || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    setLoading(true);

    try {
      if (category === "All") {
        const result = await fetchAllBooks();
        setBooks(result.books || []);
      } else {
        const result = await fetchBooksByCategory(category.toLowerCase());
        setBooks(result.books || []);
      }
    } catch (error) {
      console.error("Category filter error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (bookId, priceType) => {
    if (!isAuth) {
      navigate("/sign-in?next=/buy");
      return;
    }

    setAddingToCart(bookId);
    try {
      await addBookToCart(userData.id, { book_id: bookId, quantity: 1, priceType });
      showToast("Book added to cart!", { type: "success" });
    } catch (error) {
      console.error("Add to cart error:", error);
      showToast("Failed to add book to cart", { type: "error" });
    } finally {
      setAddingToCart(null);
    }
  };

  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.priceBuy || 0) - (b.priceBuy || 0);
      case "price-high":
        return (b.priceBuy || 0) - (a.priceBuy || 0);
      case "title":
        return (a.title || "").localeCompare(b.title || "");
      case "newest":
      default:
        return (b.id || 0) - (a.id || 0);
    }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#312e81] py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            BookBay Marketplace
          </h1>
          <p className="text-lg text-indigo-200 mb-8 max-w-2xl mx-auto">
            Discover thousands of books to buy or borrow. From bestsellers to hidden gems.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books by title, author, or keyword..."
                  className="w-full px-5 py-4 rounded-xl text-slate-900 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[1rem]"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-[0.85rem] font-medium transition ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="title">Title: A-Z</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 text-[0.9rem]">
            {loading ? "Loading..." : `Showing ${sortedBooks.length} book(s)`}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-slate-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No books found</h3>
            <p className="text-slate-500 mb-6">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : "No books available in this category yet."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                loadBooks();
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              View All Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onAddToCart={handleAddToCart}
                isAuth={isAuth}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
