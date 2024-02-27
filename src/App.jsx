import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import ScrollToTop from "./components/ScrollToTop";
import { Sell } from "./pages/Sell";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <div className="app min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<Categories />} />
            <Route path="/thank" element={<Thanks />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/borrow" element={<Borrow />} />
            <Route path="/connect-wallet" element={<WalletConnect />} />
            <Route path="/books/:bookId" element={<BookDetails />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/success" element={<Success />} />
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
    </BrowserRouter>
  );
}

export default App;
