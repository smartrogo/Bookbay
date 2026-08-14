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
  { id: 1, name: "Super Admin", email: "superadmin@example.com", phone: "+2348000000001", role: "superadmin", is_admin: true, is_superadmin: true, status: "active", joined: "2026-01-01" },
  { id: 2, name: "BookBay Admin", email: "admin@example.com", phone: "+2348000000000", role: "admin", is_admin: true, is_superadmin: false, status: "active", joined: "2026-01-01" },
  { id: 3, name: "Aisha Bello", email: "aisha@example.com", phone: "+2348012345678", role: "user", is_admin: false, is_superadmin: false, status: "active", joined: "2026-01-12" },
  { id: 4, name: "John Mensah", email: "john@example.com", phone: "+233201234567", role: "user", is_admin: false, is_superadmin: false, status: "active", joined: "2026-02-03" },
  { id: 5, name: "Ngozi Okonkwo", email: "ngozi@example.com", phone: "+2348023456789", role: "user", is_admin: false, is_superadmin: false, status: "active", joined: "2026-02-18" },
  { id: 6, name: "Kwame Asante", email: "kwame@example.com", phone: "+233241234567", role: "user", is_admin: false, is_superadmin: false, status: "suspended", joined: "2026-03-22" },
];

const DEMO_BORROWS = [
  { id: 1, user: "Aisha Bello", book: "Things Fall Apart", days: 14, status: "pending", requested: "2026-08-04" },
  { id: 2, user: "John Mensah", book: "Atomic Habits", days: 7, status: "approved", requested: "2026-08-02" },
  { id: 3, user: "Fatima Sani", book: "Born a Crime", days: 21, status: "pending", requested: "2026-08-01" },
  { id: 4, user: "Kwame Asante", book: "The Alchemist", days: 10, status: "returned", requested: "2026-07-21" },
  { id: 5, user: "Ngozi Okonkwo", book: "Sapiens", days: 14, status: "overdue", requested: "2026-07-10" },
];

const DEMO_ORDERS = [
  { id: 1, customer_name: "Aisha Bello", customer_email: "aisha@example.com", first_book: "Things Fall Apart", total: 24.99, status: "completed", reference: "ORD-8291", created_at: "2026-08-05" },
  { id: 2, customer_name: "John Mensah", customer_email: "john@example.com", first_book: "Purple Hibiscus", total: 18.5, status: "processing", reference: "ORD-8290", created_at: "2026-08-05" },
  { id: 3, customer_name: "Ngozi Okonkwo", customer_email: "ngozi@example.com", first_book: "Half of a Yellow Sun", total: 29.99, status: "completed", reference: "ORD-8289", created_at: "2026-08-04" },
  { id: 4, customer_name: "Kwame Asante", customer_email: "kwame@example.com", first_book: "The Alchemist", total: 15.75, status: "pending", reference: "ORD-8288", created_at: "2026-08-04" },
  { id: 5, customer_name: "Fatima Sani", customer_email: "fatima@example.com", first_book: "Atomic Habits", total: 22.4, status: "completed", reference: "ORD-8287", created_at: "2026-08-03" },
];

const DEMO_REVIEWS = [
  { id: 1, user_name: "Aisha Bello", book_title: "Things Fall Apart", rating: 5, comment: "A masterpiece of African literature.", created_at: "2026-08-04" },
  { id: 2, user_name: "John Mensah", book_title: "Atomic Habits", rating: 4, comment: "Very practical and easy to implement.", created_at: "2026-08-03" },
  { id: 3, user_name: "Ngozi Okonkwo", book_title: "Purple Hibiscus", rating: 5, comment: "Beautifully written, deeply moving.", created_at: "2026-08-02" },
  { id: 4, user_name: "Chinedu Eze", book_title: "Sapiens", rating: 4, comment: "Fascinating perspective on human history.", created_at: "2026-08-01" },
];

const DEMO_EXCHANGES = [
  { id: 1, requester_name: "Aisha Bello", requester_email: "aisha@example.com", offered_book_title: "Things Fall Apart", wanted_book_title: "Purple Hibiscus", status: "pending", created_at: "2026-08-04" },
  { id: 2, requester_name: "John Mensah", requester_email: "john@example.com", offered_book_title: "Atomic Habits", wanted_book_title: "Sapiens", status: "approved", created_at: "2026-08-03" },
  { id: 3, requester_name: "Fatima Sani", requester_email: "fatima@example.com", offered_book_title: "Born a Crime", wanted_book_title: "The Alchemist", status: "pending", created_at: "2026-08-02" },
];

const DEMO_SUBSCRIBERS = [
  { id: 1, email: "subscriber1@example.com", created_at: "2026-08-04" },
  { id: 2, email: "subscriber2@example.com", created_at: "2026-08-03" },
  { id: 3, email: "subscriber3@example.com", created_at: "2026-08-02" },
];

const unwrap = (res) => {
  if (res?.data && !Array.isArray(res) && res.data !== undefined && !res.data?.data) {
    return res.data;
  }
  return res;
};

// ── Dashboard ─────────────────────────────────────────────────────

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

// ── Borrow Requests ───────────────────────────────────────────────

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

// ── Books ─────────────────────────────────────────────────────────

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

// ── Users ─────────────────────────────────────────────────────────

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

export const updateUserStatus = async (id, status) => {
  try {
    const response = await apiClient.put(`/admin/users/${id}`, { status });
    const data = unwrap(response.data);
    return data?.user || data;
  } catch (error) {
    console.warn("Admin user update failed — applying local update only.", error);
    return { id, status };
  }
};

export const toggleUserAdmin = async (id, is_admin) => {
  try {
    const response = await apiClient.put(`/admin/users/${id}`, { is_admin: is_admin ? 1 : 0 });
    const data = unwrap(response.data);
    return data?.user || data;
  } catch (error) {
    console.warn("Admin toggle failed — applying local update only.", error);
    return { id, is_admin };
  }
};

export const toggleUserSuperAdmin = async (id, is_superadmin) => {
  try {
    const response = await apiClient.put(`/admin/users/${id}`, { is_superadmin: is_superadmin ? 1 : 0 });
    const data = unwrap(response.data);
    return data?.user || data;
  } catch (error) {
    console.warn("Superadmin toggle failed — applying local update only.", error);
    return { id, is_superadmin };
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return unwrap(response.data);
  } catch (error) {
    console.warn("Admin user delete failed.", error);
    throw error;
  }
};

// ── Orders ────────────────────────────────────────────────────────

export const fetchAdminOrders = async (params = {}) => {
  try {
    const response = await apiClient.get("/admin/orders", { params });
    const data = unwrap(response.data);
    const orders = Array.isArray(data) ? data : data?.orders || data?.data;
    return Array.isArray(orders) && orders.length ? orders : DEMO_ORDERS;
  } catch (error) {
    console.warn("Admin orders endpoint unavailable — showing demo data.", error);
    return DEMO_ORDERS;
  }
};

export const updateAdminOrder = async (id, status) => {
  try {
    const response = await apiClient.put(`/admin/orders/${id}`, { status });
    const data = unwrap(response.data);
    return data?.order || data;
  } catch (error) {
    console.warn("Admin order update failed — applying local update only.", error);
    return { id, status };
  }
};

// ── Reviews ───────────────────────────────────────────────────────

export const fetchAdminReviews = async (params = {}) => {
  try {
    const response = await apiClient.get("/admin/reviews", { params });
    const data = unwrap(response.data);
    const reviews = Array.isArray(data) ? data : data?.reviews || data?.data;
    return Array.isArray(reviews) && reviews.length ? reviews : DEMO_REVIEWS;
  } catch (error) {
    console.warn("Admin reviews endpoint unavailable — showing demo data.", error);
    return DEMO_REVIEWS;
  }
};

export const deleteAdminReview = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/reviews/${id}`);
    return unwrap(response.data);
  } catch (error) {
    console.warn("Admin review delete failed.", error);
    throw error;
  }
};

// ── Exchanges ─────────────────────────────────────────────────────

export const fetchAdminExchanges = async (params = {}) => {
  try {
    const response = await apiClient.get("/admin/exchanges", { params });
    const data = unwrap(response.data);
    const exchanges = Array.isArray(data) ? data : data?.exchanges || data?.data;
    return Array.isArray(exchanges) && exchanges.length ? exchanges : DEMO_EXCHANGES;
  } catch (error) {
    console.warn("Admin exchanges endpoint unavailable — showing demo data.", error);
    return DEMO_EXCHANGES;
  }
};

export const updateAdminExchange = async (id, status) => {
  try {
    const response = await apiClient.put(`/admin/exchanges/${id}`, { status });
    const data = unwrap(response.data);
    return data?.exchange || data;
  } catch (error) {
    console.warn("Admin exchange update failed — applying local update only.", error);
    return { id, status };
  }
};

// ── Newsletter Subscribers ────────────────────────────────────────

export const fetchAdminSubscribers = async () => {
  try {
    const response = await apiClient.get("/admin/subscribers");
    const data = unwrap(response.data);
    const subscribers = Array.isArray(data) ? data : data?.subscribers || data?.data;
    return Array.isArray(subscribers) && subscribers.length ? subscribers : DEMO_SUBSCRIBERS;
  } catch (error) {
    console.warn("Admin subscribers endpoint unavailable — showing demo data.", error);
    return DEMO_SUBSCRIBERS;
  }
};

export const deleteAdminSubscriber = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/subscribers/${id}`);
    return unwrap(response.data);
  } catch (error) {
    console.warn("Admin subscriber delete failed.", error);
    throw error;
  }
};

// ── Site Settings (superadmin only) ──────────────────────────────

const DEMO_SETTINGS = [
  { key: "site_name", value: "BookBay" },
  { key: "site_description", value: "Your online bookstore for buying, selling, and borrowing books." },
  { key: "site_url", value: "https://bookbay.com" },
  { key: "support_email", value: "support@bookbay.com" },
  { key: "maintenance_mode", value: "false" },
  { key: "allow_registration", value: "true" },
  { key: "max_books_per_user", value: "50" },
  { key: "borrow_max_days", value: "30" },
  { key: "min_borrow_days", value: "1" },
  { key: "currency", value: "USD" },
];

export const fetchAdminSettings = async () => {
  try {
    const response = await apiClient.get("/admin/settings");
    const data = unwrap(response.data);
    const settings = Array.isArray(data) ? data : data?.settings || data?.data;
    return Array.isArray(settings) && settings.length ? settings : DEMO_SETTINGS;
  } catch (error) {
    console.warn("Admin settings endpoint unavailable — showing demo data.", error);
    return DEMO_SETTINGS;
  }
};

export const updateAdminSetting = async (key, value) => {
  try {
    const response = await apiClient.put(`/admin/settings/${key}`, { value });
    const data = unwrap(response.data);
    return data?.setting || data;
  } catch (error) {
    console.warn("Admin setting update failed — applying local update only.", error);
    return { key, value };
  }
};

export const deleteAdminSetting = async (key) => {
  try {
    const response = await apiClient.delete(`/admin/settings/${key}`);
    return unwrap(response.data);
  } catch (error) {
    console.warn("Admin setting delete failed.", error);
    throw error;
  }
};

export const exportSettings = async () => {
  try {
    const response = await apiClient.get("/admin/settings/export", {
      responseType: "blob",
    });

    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `bookbay-settings-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.warn("Settings export failed.", error);
    throw error;
  }
};

export const importSettings = async (settingsData, overwrite = false) => {
  try {
    const response = await apiClient.post("/admin/settings/import", {
      settings: settingsData,
      overwrite,
    });
    return unwrap(response.data);
  } catch (error) {
    console.warn("Settings import failed.", error);
    throw error;
  }
};

export const parseSettingsFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.settings && Array.isArray(data.settings)) {
          resolve(data.settings);
        } else {
          reject(new Error("Invalid format: missing 'settings' array"));
        }
      } catch (err) {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
