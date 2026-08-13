import { apiClient } from "./api";

const createPlaceholderCover = (title = "Book") => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='900'>
    <rect width='100%' height='100%' fill='#f5f3ff'/>
    <rect x='24' y='24' width='552' height='852' rx='24' fill='#ffffff'/>
    <text x='50%' y='44%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='28' fill='#4f46e5'>${title}</text>
    <text x='50%' y='58%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='#6b7280'>BookBay demo cover</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const DEMO_BOOKS = [
  {
    id: 1,
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    category: "fiction",
    cover: createPlaceholderCover("Things Fall Apart"),
    coverPic: createPlaceholderCover("Things Fall Apart"),
    name: "Things Fall Apart",
    releaseDate: "1958",
    year: "1958",
    priceBuy: 24.99,
    priceBorrow: 8.99,
    description: "A modern classic exploring family, culture, and change in Nigeria.",
    stock: 10,
    status: "active",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "self-help",
    cover: createPlaceholderCover("Atomic Habits"),
    coverPic: createPlaceholderCover("Atomic Habits"),
    name: "Atomic Habits",
    releaseDate: "2018",
    year: "2018",
    priceBuy: 19.5,
    priceBorrow: 6.5,
    description: "A practical guide to building habits that stick.",
    stock: 8,
    status: "active",
  },
  {
    id: 3,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "fiction",
    cover: createPlaceholderCover("The Alchemist"),
    coverPic: createPlaceholderCover("The Alchemist"),
    name: "The Alchemist",
    releaseDate: "1988",
    year: "1988",
    priceBuy: 15.75,
    priceBorrow: 5.25,
    description: "A timeless story of destiny, courage, and self-discovery.",
    stock: 12,
    status: "active",
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "history",
    cover: createPlaceholderCover("Sapiens"),
    coverPic: createPlaceholderCover("Sapiens"),
    name: "Sapiens",
    releaseDate: "2011",
    year: "2011",
    priceBuy: 31.2,
    priceBorrow: 9.5,
    description: "A sweeping history of humankind from prehistory to the present.",
    stock: 5,
    status: "active",
  },
  {
    id: 5,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "programming",
    cover: createPlaceholderCover("Clean Code"),
    coverPic: createPlaceholderCover("Clean Code"),
    name: "Clean Code",
    releaseDate: "2008",
    year: "2008",
    priceBuy: 39.99,
    priceBorrow: 12.25,
    description: "An essential handbook for writing software that is easy to read and maintain.",
    stock: 7,
    status: "active",
  },
  {
    id: 6,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "programming",
    cover: createPlaceholderCover("The Pragmatic Programmer"),
    coverPic: createPlaceholderCover("The Pragmatic Programmer"),
    name: "The Pragmatic Programmer",
    releaseDate: "1999",
    year: "1999",
    priceBuy: 34.4,
    priceBorrow: 10.8,
    description: "A practical guide for modern software developers.",
    stock: 6,
    status: "active",
  },
  {
    id: 7,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "finance",
    cover: createPlaceholderCover("The Psychology of Money"),
    coverPic: createPlaceholderCover("The Psychology of Money"),
    name: "The Psychology of Money",
    releaseDate: "2020",
    year: "2020",
    priceBuy: 18.8,
    priceBorrow: 6.8,
    description: "A thoughtful exploration of how behavior shapes financial success.",
    stock: 9,
    status: "active",
  },
  {
    id: 8,
    title: "Deep Work",
    author: "Cal Newport",
    category: "self-help",
    cover: createPlaceholderCover("Deep Work"),
    coverPic: createPlaceholderCover("Deep Work"),
    name: "Deep Work",
    releaseDate: "2016",
    year: "2016",
    priceBuy: 17.2,
    priceBorrow: 5.9,
    description: "Learn to focus deeply and produce meaningful work.",
    stock: 4,
    status: "active",
  },
];

const CATEGORY_ALIASES = {
  programming: ["programming", "software", "developer", "computer science"],
  science: ["science", "biology", "chemistry", "physics"],
  history: ["history", "politics/history"],
  religious: ["religious", "spirituality"],
  computer: ["computer", "computer science", "programming"],
  adventures: ["adventures"],
  biography: ["biography"],
  fiction: ["fiction"],
  "non-fiction": ["non-fiction", "non fiction"],
  "children/adult": ["children/adult", "children", "adult"],
  "science/technology": ["science/technology", "technology", "tech"],
  "business/economics": ["business/economics", "business", "economics"],
  "cooking&food": ["cooking&food", "food", "cooking"],
  art_and_photography: ["art_and_photography", "art", "photography"],
  spirituality: ["spirituality", "religious"],
  "education and teaching": ["education and teaching", "education", "teaching"],
  "health and wellness": ["health and wellness", "health", "wellness"],
  philosophy: ["philosophy"],
  "parenting and family": ["parenting and family", "parenting", "family"],
};

const unwrapBooks = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.books)) return payload.books;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const normalizeBook = (book, index = 0) => {
  if (!book || typeof book !== "object") return null;

  const title = book.title || book.name || `Demo Book ${index + 1}`;
  const category = String(book.category || book.category_name || "general").toLowerCase();

  return {
    ...book,
    id: book.id ?? book.bookId ?? book.book_id ?? index + 1,
    title,
    name: book.name || title,
    author: book.author || book.author_name || "Unknown author",
    category,
    cover: book.cover || book.coverPic || book.image || createPlaceholderCover(title),
    coverPic: book.coverPic || book.cover || createPlaceholderCover(title),
    releaseDate: book.releaseDate || book.year || book.publish_year || "N/A",
    year: book.year || book.releaseDate || book.publish_year || "N/A",
    priceBuy: book.priceBuy ?? book.buy_price ?? book.price ?? 24.99,
    priceBorrow: book.priceBorrow ?? book.borrow_price ?? 8.99,
    description: book.description || "A curated title from BookBay.",
    stock: book.stock ?? 10,
    status: book.status || "active",
  };
};

const matchesCategory = (book, category) => {
  const normalizedCategory = String(category || "").trim().toLowerCase();
  if (!normalizedCategory) return true;

  const aliases = CATEGORY_ALIASES[normalizedCategory] || [normalizedCategory];
  const bookCategory = String(book.category || "").toLowerCase();

  return aliases.some((alias) => bookCategory.includes(alias));
};

const getDemoBooks = () => DEMO_BOOKS.map((book, index) => normalizeBook(book, index));

const getStoredCart = () => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem("bookbay_cart") || "[]") || [];
  } catch (error) {
    console.warn("Unable to read cart from storage.", error);
    return [];
  }
};

const setStoredCart = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("bookbay_cart", JSON.stringify(items));
};

export const fetchBookById = async (bookId) => {
  try {
    const response = await apiClient.get(`/books/${bookId}`);
    const payload = unwrapBooks(response.data);
    if (payload.length) {
      const match = payload.find((item) => String(item.id ?? item.bookId ?? item.book_id) === String(bookId));
      return normalizeBook(match || payload[0]);
    }

    if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
      return normalizeBook(response.data);
    }
  } catch (error) {
    console.warn("Backend books endpoint unavailable — using demo data.", error);
  }

  const fallbackBook = getDemoBooks().find((book) => String(book.id) === String(bookId));
  return fallbackBook || getDemoBooks()[0];
};

export const searchBooks = async (query) => {
  try {
    const response = await apiClient.get("/books", {
      params: { q: query },
    });
    const payload = unwrapBooks(response.data);
    const books = payload.map((book, index) => normalizeBook(book, index));
    return { books };
  } catch (error) {
    console.warn("Backend search unavailable — using demo results.", error);
  }

  const safeQuery = String(query || "").toLowerCase();
  const books = getDemoBooks().filter((book) => {
    const haystack = `${book.title} ${book.author} ${book.category}`.toLowerCase();
    return haystack.includes(safeQuery);
  });

  return { books };
};

export const fetchBooksByCategory = async (category) => {
  try {
    const response = await apiClient.get("/books", {
      params: { category },
    });
    const payload = unwrapBooks(response.data);
    const books = payload.map((book, index) => normalizeBook(book, index));
    return { books };
  } catch (error) {
    console.warn("Backend category listing unavailable — using demo data.", error);
  }

  const books = getDemoBooks().filter((book) => matchesCategory(book, category));
  return { books };
};

export const fetchAllBooks = async () => {
  try {
    const response = await apiClient.get("/books");
    const payload = unwrapBooks(response.data);
    const books = payload.map((book, index) => normalizeBook(book, index));
    return { books };
  } catch (error) {
    console.warn("Backend books listing unavailable — using demo data.", error);
  }

  return { books: getDemoBooks() };
};

export const fetchUserBooks = async (userId) => {
  try {
    const response = await apiClient.get(`/books/user/${userId}`);
    const payload = unwrapBooks(response.data);
    const books = payload.map((book, index) => normalizeBook(book, index));
    return { books };
  } catch (error) {
    console.warn("User books endpoint unavailable — using demo data.", error);
  }

  return { books: getDemoBooks().slice(0, 3) };
};

export const fetchCartItems = async (userId) => {
  try {
    const response = await apiClient.get(`/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.warn("Cart endpoint unavailable — using local fallback.", error);
    return { items: getStoredCart() };
  }
};

export const addBookToCart = async (userId, payload) => {
  try {
    const response = await apiClient.post(`/cart/${userId}`, payload);
    return response.data;
  } catch (error) {
    const item = {
      id: Date.now(),
      userId,
      ...payload,
    };
    const items = [...getStoredCart(), item];
    setStoredCart(items);
    return item;
  }
};

export const startPayment = async (userId, payload) => {
  try {
    const response = await apiClient.post(`/payments/start/${userId}`, payload);
    return response.data;
  } catch (error) {
    console.warn("Payment start unavailable — using demo reference.", error);
    return { success: true, reference: `demo-${Date.now()}` };
  }
};

export const removeCartItem = async (userId, cartItemId) => {
  try {
    const response = await apiClient.delete(`/cart/${userId}/${cartItemId}`);
    return response.data;
  } catch (error) {
    const nextItems = getStoredCart().filter((item) => item.id !== cartItemId);
    setStoredCart(nextItems);
    return { items: nextItems };
  }
};

export const verifyPayment = async (userId, reference) => {
  try {
    const response = await apiClient.post(`/payments/verify/${userId}`, {
      reference,
    });
    return response.data;
  } catch (error) {
    console.warn("Payment verification unavailable — using demo confirmation.", error);
    return { success: true, reference, status: "paid" };
  }
};
