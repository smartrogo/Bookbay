import { apiClient } from "./api";

/**
 * Admin service — talks to the Laravel backend `/admin/*` endpoints.
 * Every function gracefully falls back to demo data when the backend
 * endpoint is not yet available, so the dashboard is always usable.
 */

const DEMO_DASHBOARD = {
  stats: {
    total_books: 1284,
    total_users: 342,
    total_orders: 876,
    total_revenue: 45280,
    pending_borrow_requests: 23,
    pending_orders: 41,
    new_messages: 12,
  },
  revenue_by_month: [
    { month: "Jan", amount: 2400 },
    { month: "Feb", amount: 3100 },
    { month: "Mar", amount: 2800 },
    { month: "Apr", amount: 3900 },
    { month: "May", amount: 3500 },
    { month: "Jun", amount: 4200 },
    { month: "Jul", amount: 5100 },
    { month: "Aug", amount: 4600 },
    { month: "Sep", amount: 5800 },
    { month: "Oct", amount: 6300 },
    { month: "Nov", amount: 7100 },
    { month: "Dec", amount: 8480 },
  ],
  recent_orders: [
    { id: "ORD-8291", customer: "Aisha Bello", book: "Things Fall Apart", amount: 24.99, status: "completed", date: "2026-08-05" },
    { id: "ORD-8290", customer: "John Mensah", book: "Purple Hibiscus", amount: 18.5, status: "processing", date: "2026-08-05" },
    { id: "ORD-8289", customer: "Ngozi Okonkwo", book: "Half of a Yellow Sun", amount: 29.99, status: "completed", date: "2026-08-04" },
    { id: "ORD-8288", customer: "Kwame Asante", book: "The Alchemist", amount: 15.75, status: "pending", date: "2026-08-04" },
    { id: "ORD-8287", customer: "Fatima Sani", book: "Atomic Habits", amount: 22.4, status: "completed", date: "2026-08-03" },
    { id: "ORD-8286", customer: "Chinedu Eze", book: "Sapiens", amount: 31.2, status: "cancelled", date: "2026-08-03" },
  ],
};

const DEMO_BOOKS = [
  { id: 1, title: "Things Fall Apart", author: "Chinua Achebe", category: "Fiction", price: 24.99, stock: 12, status: "active" },
  { id: 2, title: "Purple Hibiscus", author: "Chimamanda Adichie", category: "Fiction", price: 18.5, stock: 8, status: "active" },
  { id: 3, title: "Half of a Yellow Sun", author: "Chimamanda Adichie", category: "Fiction", price: 29.99, stock: 5, status: "active" },
  { id: 4, title: "The Alchemist", author: "Paulo Coelho", category: "Self-Help", price: 15.75, stock: 20, status: "active" },
  { id: 5, title: "Atomic Habits", author: "James Clear", category: "Self-Help", price: 22.4, stock: 3, status: "active" },
  { id: 6, title: "Sapiens", author: "Yuval Noah Harari", category: "History", price: 31.2, stock: 0, status: "inactive" },
  { id: 7, title: "Born a Crime", author: "Trevor Noah", category: "Biography", price: 19.99, stock: 14, status: "active" },
  { id: 8, title: "The Lion and the Jewel", author: "Wole Soyinka", category: "Drama", price: 12.5, stock: 9, status: "active" },
];

const DEMO_USERS = [
  { id: 1, name: "Aisha Bello", email: "aisha@example.com", phone: "+2348012345678", role: "user", status: "active", joined: "2026-01-12" },
  { id: 2, name: "John Mensah", email: "john@example.com", phone: "+233201234567", role: "user", status: "active", joined: "2026-02-03" },
  { id: 3, name: "Ngozi Okonkwo", email: "ngozi@example.com", phone: "+2348023456789", role: "user", status: "active", joined: "2026-02-18" },
  { id: 4, name: "Kwame Asante", email: "kwame@example.com", phone: "+233241234567", role: "user", status: "suspended", joined: "2026-03-22" },
  { id: 5, name: "Fatima Sani", email: "fatima@example.com", phone: "+2348034567890", role: "user", status: "active", joined: "2026-04-09" },
  { id: 6, name: "Chinedu Eze", email: "chinedu@example.com", phone: "+2348045678901", role: "user", status: "active", joined: "2026-05-27" },
];

const DEMO_BORROWS = [
  { id: 1, user: "Aisha Bello", book: "Things Fall Apart", days: 14, status: "pending", requested: "2026-08-04" },
  { id: 2, user: "John Mensah", book: "Atomic Habits", days: 7, status: "approved", requested: "2026-08-02" },
  { id: 3, user: "Fatima Sani", book: "Born a Crime", days: 21, status: "pending", requested: "2026-08-01" },
  { id: 4, user: "Kwame Asante", book: "The Alchemist", days: 10, status: "returned", requested: "2026-07-21" },
  { id: 5, user: "Ngozi Okonkwo", book: "Sapiens", days: 14, status: "overdue", requested: "2026-07-10" },
];

const unwrap = (res) => {
  if (res?.data && !Array.isArray(res) && res.data !== undefined && !res.data?.data) {
    return res.data;
  }
  return res;
};

export const fetchAdminDashboard = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard");
    const data = unwrap(response.data);
    if (!data || !data.stats) return DEMO_DASHBOARD;
    return data;
  } catch (error) {
    console.warn("Admin dashboard endpoint unavailable — showing demo data.", error);
    return DEMO_DASHBOARD;
  }
};

export const updateAdminBorrowRequest = async (id, updates = {}) => {
  try {
    const response = await apiClient.patch(`/admin/borrow/${id}`, updates);
    const data = unwrap(response.data);
    const borrowRequest = data?.borrow_request || data?.data || data;
    return borrowRequest || { id, ...updates };
  } catch (error) {
    console.warn("Admin borrow update failed — applying local update only.", error);
    return { id, ...updates };
  }
};

export const updateAdminBookStatus = async (id, updates = {}) => {
  try {
    const response = await apiClient.put(`/admin/books/${id}`, updates);
    const data = unwrap(response.data);
    const book = data?.book || data?.data || data;
    return book || { id, ...updates };
  } catch (error) {
    console.warn("Admin book update failed — applying local update only.", error);
    return { id, ...updates };
  }
};

export const fetchAdminBooks = async (params = {}) => {
  try {
    const response = await apiClient.get("/admin/books", { params });
    const data = unwrap(response.data);
    const books = Array.isArray(data) ? data : data?.books || data?.data;
    return Array.isArray(books) && books.length ? books : DEMO_BOOKS;
  } catch (error) {
    console.warn("Admin books endpoint unavailable — showing demo data.", error);
    return DEMO_BOOKS;
  }
};

export const fetchAdminUsers = async (params = {}) => {
  try {
    const response = await apiClient.get("/admin/users", { params });
    const data = unwrap(response.data);
    const users = Array.isArray(data) ? data : data?.users || data?.data;
    return Array.isArray(users) && users.length ? users : DEMO_USERS;
  } catch (error) {
    console.warn("Admin users endpoint unavailable — showing demo data.", error);
    return DEMO_USERS;
  }
};

export const fetchAdminBorrowRequests = async (params = {}) => {
  try {
    const response = await apiClient.get("/admin/borrow", { params });
    const data = unwrap(response.data);
    const borrows = Array.isArray(data) ? data : data?.borrow_requests || data?.data;
    return Array.isArray(borrows) && borrows.length ? borrows : DEMO_BORROWS;
  } catch (error) {
    console.warn("Admin borrow endpoint unavailable — showing demo data.", error);
    return DEMO_BORROWS;
  }
};
