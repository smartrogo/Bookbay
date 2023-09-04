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
  // RedirectToSignIn,
  // SignIn,
  // SignUp,
  // UserButton,
} from "@clerk/clerk-react";
// import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { Dashboard } from "./pages/Dashboard";
import { SignInPage } from "./pages/SignInPage";
import Categories from "./pages/Categories";

const clerkPubKey = import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}


function ClerkProviderWithRoutes() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const userPref = localStorage.getItem("theme");
    if (userPref == "dark") {
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
      <div>
        <Header onClick={handleTheme} darkMode={darkMode} />
      </div> 

      <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <Dashboard routing="path" path="/dashboard"/>
                </SignedIn>
                <SignedOut>
                  <Home routing="path" path="/"/>
                </SignedOut>
              </>
            }
          />
          <Route path="/category/:category" element={<Categories />} />
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
