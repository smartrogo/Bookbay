import { apiClient } from "./api";

const createPlaceholderCover = (title = "Book") => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='900'>
    <rect width='100%' height='100%' fill='#f5f3ff'/>
    <rect x='24' y='24' width='552' height='852' rx='24' fill='#ffffff'/>
    <text x='50%' y='44%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='28' fill='#4f46e5'>${title}</text>
    <text x='50%' y='58%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='#6b7280'>BookBay</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const normalizeBook = (book) => ({
  id: book.id,
  title: book.title || "Untitled",
  author: book.author || "Unknown",
  category: book.category || "General",
  cover: book.cover || book.coverPic || createPlaceholderCover(book.title),
  coverPic: book.coverPic || book.cover || createPlaceholderCover(book.title),
  priceBuy: book.priceBuy ?? 0,
  priceBorrow: book.priceBorrow ?? 0,
  stock: book.stock ?? 0,
  year: book.year || "",
  description: book.description || "",
  reasons: book.reasons || [],
});

const DEMO_RECOMMENDATIONS = [
  {
    id: 1,
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    category: "Fiction",
    cover: createPlaceholderCover("Things Fall Apart"),
    priceBuy: 24.99,
    priceBorrow: 8.99,
    stock: 10,
    reasons: ["popular"],
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    cover: createPlaceholderCover("Atomic Habits"),
    priceBuy: 19.5,
    priceBorrow: 6.5,
    stock: 8,
    reasons: ["popular"],
  },
  {
    id: 3,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    cover: createPlaceholderCover("The Alchemist"),
    priceBuy: 15.75,
    priceBorrow: 5.25,
    stock: 12,
    reasons: ["popular"],
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    cover: createPlaceholderCover("Sapiens"),
    priceBuy: 31.2,
    priceBorrow: 9.5,
    stock: 5,
    reasons: ["popular"],
  },
  {
    id: 5,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    cover: createPlaceholderCover("Clean Code"),
    priceBuy: 39.99,
    priceBorrow: 12.25,
    stock: 7,
    reasons: ["popular"],
  },
  {
    id: 6,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Business",
    cover: createPlaceholderCover("The Psychology of Money"),
    priceBuy: 18.8,
    priceBorrow: 6.8,
    stock: 9,
    reasons: ["popular"],
  },
];

const DEMO_RECENTLY_VIEWED = [
  {
    id: 7,
    title: "Deep Work",
    author: "Cal Newport",
    category: "Self-Help",
    cover: createPlaceholderCover("Deep Work"),
    priceBuy: 17.2,
    priceBorrow: 5.9,
    stock: 4,
    reasons: ["recently viewed"],
  },
  {
    id: 5,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    cover: createPlaceholderCover("Clean Code"),
    priceBuy: 39.99,
    priceBorrow: 12.25,
    stock: 7,
    reasons: ["recently viewed"],
  },
];

/**
 * Get personalized book recommendations based on user history.
 */
export const fetchPersonalizedRecommendations = async (limit = 12) => {
  try {
    const response = await apiClient.get("/recommendations/personalized", {
      params: { limit },
    });
    const data = response.data;
    const books = data?.recommendations || [];
    return Array.isArray(books) && books.length
      ? books.map(normalizeBook)
      : DEMO_RECOMMENDATIONS.map(normalizeBook);
  } catch (error) {
    console.warn("Recommendations endpoint unavailable — using demo data.", error);
    return DEMO_RECOMMENDATIONS.map(normalizeBook);
  }
};

/**
 * Get recently viewed books for the authenticated user.
 */
export const fetchRecentlyViewed = async (limit = 8) => {
  try {
    const response = await apiClient.get("/recommendations/recently-viewed", {
      params: { limit },
    });
    const data = response.data;
    const books = data?.recently_viewed || [];
    return Array.isArray(books) && books.length
      ? books.map(normalizeBook)
      : DEMO_RECENTLY_VIEWED.map(normalizeBook);
  } catch (error) {
    console.warn("Recently viewed endpoint unavailable — using demo data.", error);
    return DEMO_RECENTLY_VIEWED.map(normalizeBook);
  }
};

/**
 * Get books similar to a given book.
 */
export const fetchSimilarBooks = async (bookId, limit = 6) => {
  try {
    const response = await apiClient.get(`/recommendations/similar/${bookId}`, {
      params: { limit },
    });
    const data = response.data;
    const books = data?.similar_books || [];
    return Array.isArray(books) && books.length
      ? books.map(normalizeBook)
      : DEMO_RECOMMENDATIONS.slice(0, limit).map(normalizeBook);
  } catch (error) {
    console.warn("Similar books endpoint unavailable — using demo data.", error);
    return DEMO_RECOMMENDATIONS.slice(0, limit).map(normalizeBook);
  }
};

/**
 * Track a book view event for the authenticated user.
 */
export const trackBookView = async (bookId) => {
  try {
    await apiClient.post("/recommendations/track-view", { book_id: bookId });
  } catch (error) {
    console.warn("Failed to track book view.", error);
  }
};
