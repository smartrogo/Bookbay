import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { ErrorPage } from "./pages/ErrorPage";
import { SignUpPage } from "./pages/SignUpPage";
import { SignInPage } from "./pages/SignInPage";
import Categories from "./pages/Categories";
import { Thanks } from "./pages/Thanks";
import { Profile } from "./pages/Profile";
import { About } from "./pages/About";
import { Success } from "./pages/Success";
import { MyBooks } from "./pages/MyBooks";
import { Borrow } from "./pages/Borrow";
import { Buy } from "./pages/Buy";
import { Wallet } from "./pages/Wallet";
import { WalletConnect } from "./pages/WalletConnect";
import { FAQs } from "./pages/FAQs";
import { Policy } from "./pages/Policy";
import { ServiceTerms } from "./pages/ServiceTerms";
import { BookDetails } from "./pages/BookDetails";
import { Cart } from "./pages/Cart";
import { ProtectedRoute, AdminRoute } from "./pages/ProtectedRoute";
import { AuthProvider } from "./AuthContext";
import { ToastProvider } from "./ToastContext";
import { ToastContainer } from "./components/ToastContainer";
import { BookProvider } from "./BookContext";
import { UserProvider } from "./UserContext";
import ScrollToTop from "./components/ScrollToTop";
import { Sell } from "./pages/Sell";
import { Orders } from "./pages/Orders";
import { Wishlist } from "./pages/Wishlist";
import { Dashboard } from "./pages/Dashboard";
import { AdminLogin } from "./pages/AdminLogin";

const StoreHeader = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return isAdminRoute ? null : <Header />;
};

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <BookProvider>
          <ToastProvider>
            <AuthProvider>
            <ScrollToTop />
            <div className="app min-h-screen">
              <StoreHeader />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:category" element={<Categories />} />
                <Route path="/thank" element={<Thanks />} />
                <Route path="/sign-in/*" element={<SignInPage />} />
                <Route path="/sign-up/*" element={<SignUpPage />} />
                <Route path="/about-us" element={<About />} />
                <Route path="/borrow" element={<ProtectedRoute />}>
                  <Route path="/borrow" element={<Borrow />} />
                </Route>
                <Route path="/wallet" element={<ProtectedRoute />}>
                  <Route path="/wallet" element={<Wallet />} />
                </Route>
                <Route path="/dashboard" element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminRoute />}>
                  <Route path="/admin" element={<Dashboard />} />
                </Route>
                <Route path="/admin/dashboard" element={<AdminRoute />}>
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/connect-wallet" element={<WalletConnect />} />
                <Route path="/books/:bookId" element={<BookDetails />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/orders" element={<ProtectedRoute />}>
                  <Route path="/orders" element={<Orders />} />
                </Route>
                <Route path="/wishlist" element={<ProtectedRoute />}>
                  <Route path="/wishlist" element={<Wishlist />} />
                </Route>
                <Route path="/success" element={<Success />} />
                <Route path="/my-books" element={<ProtectedRoute />}> 
                  <Route path="/my-books" element={<MyBooks />} />
                </Route>
                <Route path="/terms-of-service" element={<ServiceTerms />} />
                <Route path="/privacy-policy" element={<Policy />} />
                <Route path="/frequent-questions" element={<FAQs />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/cart" element={<ProtectedRoute />}>
                  <Route path="/cart" element={<Cart />} />
                </Route>
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </div>
            </AuthProvider>
            <ToastContainer />
          </ToastProvider>
        </BookProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
