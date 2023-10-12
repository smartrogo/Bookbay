import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { ErrorPage } from "./pages/ErrorPage";
import { ClerkProvider } from "@clerk/clerk-react";
import { SignUpPage } from "./pages/SignUpPage";
import { SignInPage } from "./pages/SignInPage";
import { Dashboard } from "./pages/Dashboard";
import Categories from "./pages/Categories";
import { Thanks } from "./pages/Thanks";
import { Profile } from "./pages/Profile";
import { About } from "./pages/About";
import { Borrow } from "./pages/Borrow";
import { Buy } from "./pages/Buy";
import { WalletConnect } from "./pages/WalletConnect";
import { FAQs } from "./pages/FAQs";
import { Policy } from "./pages/Policy";
import { ServiceTerms } from "./pages/ServiceTerms";
import { BookDetails } from "./pages/BookDetails";
import { Cart } from "./pages/Cart";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { AuthProvider } from "./AuthContext";
import ScrollToTop from "./components/ScrollToTop"
if (!import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY;

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <div className={`app min-h-screen`}>
      <ClerkProvider
        publishableKey={clerkPubKey}
        navigate={(to) => navigate(to)}
      >
        <div>
          <Header />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<Categories />} />
          <Route path="thank" element={<Thanks />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/connect-wallet" element={<WalletConnect />} />
          <Route path="/books/:bookId" element={<BookDetails />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/terms-of-service" element={<ServiceTerms />} />
          <Route path="/privacy-policy" element={<Policy />} />
          <Route path="/frequent-questions" element={<FAQs />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route
            path="/dashboard"
            element={<Dashboard routing="path" path="/dashboard" />}
          />
          <Route path="/cart" element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
          </Route>
        </Routes>
      </ClerkProvider>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <ScrollToTop />
        <ClerkProviderWithRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
