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


if (!import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY;

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const userPref = localStorage.getItem("theme");
    if (userPref === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      <ClerkProvider
        publishableKey={clerkPubKey}
        navigate={(to) => navigate(to)}
      >
        <div>
          <Header onClick={handleTheme} darkMode={darkMode} />
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
          <Route path="/buy" element={<Buy />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route
            path="/dashboard"
            element={<Dashboard routing="path" path="/dashboard" />}/>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ClerkProvider>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  );
}

export default App;
