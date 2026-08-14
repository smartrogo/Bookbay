import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useToast } from "../ToastContext";
import { Footer } from "../components/Footer";
import { fetchBookById, addBookToCart } from "../services/bookService";
import { apiClient } from "../services/api";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "../services/wishlistService";
import { fetchSimilarBooks, trackBookView } from "../services/recommendationService";
import { summarizeBook } from "../services/aiService";
import { awardPoints } from "../services/gamificationService";

const formatPrice = (n) =>
  Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

const statusStyles = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-200 text-slate-600",
  outOfStock: "bg-red-100 text-red-700",
};

const StarRating = ({ rating, interactive = false, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => onChange(star) : undefined}
          onMouseEnter={interactive ? () => setHover(star) : undefined}
          onMouseLeave={interactive ? () => setHover(0) : undefined}
          className={`text-xl ${
            interactive ? "cursor-pointer" : "cursor-default"
          } ${
            star <= (interactive ? hover || rating : rating)
              ? "text-amber-400"
              : "text-slate-200"
          }`}
          disabled={!interactive}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const DEMO_REVIEWS = [
  {
    id: 1,
    user_name: "Aisha Bello",
    rating: 5,
    comment: "A masterpiece of African literature. Cannot recommend enough!",
    created_at: "2026-08-10",
  },
  {
    id: 2,
    user_name: "John Mensah",
    rating: 4,
    comment: "Beautifully written. A must-read for everyone.",
    created_at: "2026-08-08",
  },
  {
    id: 3,
    user_name: "Ngozi Okonkwo",
    rating: 5,
    comment: "Changed my perspective on so many things. Brilliant book.",
    created_at: "2026-08-05",
  },
];

export const BookDetails = () => {
  const { bookId } = useParams();
  const { userData, isAuth } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadBook();
    loadReviews();
    loadSimilarBooks();
    if (isAuth) checkWishlist();
    // Track view and award points
    if (isAuth && userData?.id) {
      trackBookView(bookId);
      awardPoints('view_book', 'Viewed a book', Number(bookId), 'book');
    }
  }, [bookId, isAuth, userData]);

  const loadBook = async () => {
    setLoading(true);
    try {
      const bookData = await fetchBookById(bookId);
      setBook(bookData);
    } catch (error) {
      console.error("Error loading book:", error);
      showToast("Failed to load book details", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await apiClient.get(`/reviews?book_id=${bookId}`);
      const data = response.data;
      const reviewList = data?.reviews || data?.data || [];
      setReviews(Array.isArray(reviewList) && reviewList.length ? reviewList : DEMO_REVIEWS);
    } catch (error) {
      console.warn("Reviews endpoint unavailable — using demo data.", error);
      setReviews(DEMO_REVIEWS);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadSimilarBooks = async () => {
    setSimilarLoading(true);
    try {
      const books = await fetchSimilarBooks(bookId, 6);
      setSimilarBooks(books);
    } catch (error) {
      console.warn("Could not load similar books.", error);
    } finally {
      setSimilarLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const response = await fetchWishlist();
      const data = response?.data || response;
      const items = data?.wishlist || data || [];
      const wishlistBookIds = items.map((item) => item.book_id || item.id);
      setIsInWishlist(wishlistBookIds.includes(Number(bookId)));
    } catch (error) {
      console.warn("Could not check wishlist status.", error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuth) {
      navigate(`/sign-in?next=/books/${bookId}`);
      return;
    }

    setAddingToCart(true);
    try {
      await addBookToCart(userData.id, { book_id: Number(bookId), quantity: 1 });
      showToast("Added to cart!", { type: "success" });
    } catch (error) {
      console.error("Add to cart error:", error);
      showToast("Failed to add to cart", { type: "error" });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuth) {
      navigate(`/sign-in?next=/books/${bookId}`);
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        // Find the wishlist item id to remove
        const response = await fetchWishlist();
        const data = response?.data || response;
        const items = data?.wishlist || data || [];
        const item = items.find((i) => (i.book_id || i.id) === Number(bookId));
        if (item) {
          await removeFromWishlist(item.wishlist_id || item.id);
        }
        setIsInWishlist(false);
        showToast("Removed from wishlist", { type: "success" });
      } else {
        await addToWishlist({ book_id: Number(bookId) });
        setIsInWishlist(true);
        showToast("Added to wishlist! +2 points earned! 🎉", { type: "success" });
        awardPoints('wishlist_add', 'Added book to wishlist', Number(bookId), 'book');
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      showToast("Failed to update wishlist", { type: "error" });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuth) {
      navigate(`/sign-in?next=/books/${bookId}`);
      return;
    }

    setSubmittingReview(true);
    try {
      await apiClient.post("/reviews", {
        book_id: Number(bookId),
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      showToast("Review submitted! +5 points earned! 🎉", { type: "success" });
      awardPoints('review', 'Wrote a review', Number(bookId), 'book');
      setShowReviewForm(false);
      setReviewRating(5);
      setReviewComment("");
      loadReviews();
    } catch (error) {
      console.error("Submit review error:", error);
      showToast(error?.message || "Failed to submit review", { type: "error" });
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : "0.0";

  const isOutOfStock = book && (book.stock || 0) === 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 aspect-[3/4] bg-slate-200 rounded-xl" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-20 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Book not found</h2>
          <p className="text-slate-500 mb-6">The book you're looking for doesn't exist.</p>
          <Link
            to="/buy"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-8 pt-24">
        {/* Breadcrumb */}
        <div className="text-[0.85rem] text-slate-500 mb-6">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/buy" className="hover:text-indigo-600">Marketplace</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{book.title}</span>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Book Cover */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <img
                  src={book.cover || book.coverPic || `https://placehold.co/600x900/eef2ff/4f46e5?text=${encodeURIComponent(book.title)}`}
                  alt={book.title}
                  className="w-full aspect-[3/4] object-cover"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/600x900/eef2ff/4f46e5?text=${encodeURIComponent(book.title)}`;
                  }}
                />
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-[0.75rem] font-medium ${
                    isOutOfStock ? statusStyles.outOfStock : statusStyles.active
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : "In Stock"}
                </span>
              </div>

              {/* Title & Author */}
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-slate-600 mb-1">
                by <span className="font-medium">{book.author}</span>
              </p>
              <p className="text-sm text-slate-500 mb-4">
                {book.year || book.releaseDate || "N/A"} · {book.category || "General"}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <StarRating rating={Math.round(Number(averageRating))} />
                <span className="text-lg font-semibold text-slate-900">{averageRating}</span>
                <span className="text-sm text-slate-500">({reviews.length} reviews)</span>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-xl p-4 text-center">
                  <p className="text-[0.75rem] text-indigo-600 uppercase tracking-wide mb-1">Buy Price</p>
                  <p className="text-2xl font-bold text-indigo-600">{formatPrice(book.priceBuy)}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-[0.75rem] text-emerald-600 uppercase tracking-wide mb-1">Borrow Price</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatPrice(book.priceBorrow)}</p>
                </div>
              </div>

              {/* Stock Info */}
              <div className="flex items-center gap-2 mb-6 text-sm text-slate-600">
                <span>📦</span>
                <span>
                  {isOutOfStock
                    ? "Currently out of stock"
                    : `${book.stock} unit(s) available`}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addingToCart}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {addingToCart ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M5.6 14A8 8 0 0118.4 10M18.4 10A8 8 0 015.6 14" />
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>🛒 Add to Cart</>
                  )}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    isInWishlist
                      ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {wishlistLoading ? (
                    "..."
                  ) : (
                    <>
                      {isInWishlist ? "❤️" : "🤍"} {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Description</h2>
              <p className="text-slate-600 leading-relaxed">
                {book.description || "No description available for this book."}
              </p>
            </div>

            {/* AI Summary */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6 shadow-sm mt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <h2 className="text-lg font-semibold text-slate-900">AI Summary</h2>
                </div>
                <button
                  onClick={async () => {
                    if (showSummary) { setShowSummary(false); return; }
                    setSummaryLoading(true);
                    setShowSummary(true);
                    try {
                      const summary = await summarizeBook(bookId);
                      setAiSummary(summary);
                    } catch (e) {
                      setAiSummary("Could not generate summary at this time.");
                    } finally {
                      setSummaryLoading(false);
                    }
                  }}
                  className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-[0.8rem] font-semibold hover:bg-indigo-700 transition"
                >
                  {showSummary ? "Hide" : "Get AI Summary"}
                </button>
              </div>
              {showSummary && (
                <div>
                  {summaryLoading ? (
                    <div className="flex items-center gap-2 text-slate-500">
                      <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                      <span className="text-[0.85rem]">Generating summary...</span>
                    </div>
                  ) : (
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-[0.9rem]">{aiSummary}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>
                <p className="text-sm text-slate-500">{reviews.length} review(s)</p>
              </div>
              {isAuth && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-[0.85rem] font-semibold hover:bg-indigo-700 transition"
                >
                  {showReviewForm ? "Cancel" : "Write a Review"}
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-slate-50 rounded-xl">
                <h3 className="font-semibold text-slate-900 mb-4">Your Review</h3>
                <div className="mb-4">
                  <label className="block text-[0.85rem] font-medium text-slate-700 mb-2">Rating</label>
                  <StarRating rating={reviewRating} interactive onChange={setReviewRating} />
                </div>
                <div className="mb-4">
                  <label className="block text-[0.85rem] font-medium text-slate-700 mb-2">Comment</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your thoughts about this book..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-[0.85rem] font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-slate-200 rounded-full" />
                      <div className="h-4 bg-slate-200 rounded w-24" />
                    </div>
                    <div className="h-3 bg-slate-200 rounded w-full mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-slate-500">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                        {(review.user_name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-[0.9rem]">
                          {review.user_name || "Anonymous"}
                        </p>
                        <p className="text-[0.75rem] text-slate-500">
                          {review.created_at || "Recently"}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating || 0} />
                    {review.comment && (
                      <p className="mt-2 text-slate-600 text-[0.9rem]">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Similar Books Section */}
        {similarBooks.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Similar Books</h2>
                  <p className="text-sm text-slate-500">You might also like these</p>
                </div>
              </div>

              {similarLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-slate-200 rounded-lg mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-3/4 mb-1" />
                      <div className="h-2 bg-slate-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {similarBooks.map((sBook) => (
                    <Link
                      key={sBook.id}
                      to={`/books/${sBook.id}`}
                      className="group"
                    >
                      <div className="aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden mb-2">
                        <img
                          src={sBook.cover || sBook.coverPic || `https://placehold.co/300x450/eef2ff/4f46e5?text=${encodeURIComponent(sBook.title)}`}
                          alt={sBook.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = `https://placehold.co/300x450/eef2ff/4f46e5?text=${encodeURIComponent(sBook.title)}`;
                          }}
                        />
                      </div>
                      <p className="font-medium text-slate-900 text-[0.85rem] line-clamp-1 group-hover:text-indigo-600 transition">
                        {sBook.title}
                      </p>
                      <p className="text-[0.75rem] text-slate-500">{sBook.author}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[0.8rem] font-semibold text-indigo-600">
                          {formatPrice(sBook.priceBuy)}
                        </p>
                        {sBook.reasons && sBook.reasons.length > 0 && (
                          <span className="text-[0.65rem] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full">
                            {sBook.reasons[0]}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
