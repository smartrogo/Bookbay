import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { ErrorPage } from "./pages/ErrorPage";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { SignUpPage } from "./pages/SignUpPage";
import { SignInPage } from "./pages/SignInPage";
import { Dashboard } from "./pages/Dashboard";
import Categories from "./pages/Categories";
import { PlayGround } from "./components/playGround";
import { Thanks } from "./pages/Thanks";

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
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route
            path="/dashboard"
            element={<Dashboard routing="path" path="/dashboard" />}
          />
          <Route path="/category/:category" element={<Categories />} />
          <Route path="play" element={<PlayGround />} />
          <Route path="thank" element={<Thanks />} />

          {/* Catch-all route for unmatched routes */}
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
