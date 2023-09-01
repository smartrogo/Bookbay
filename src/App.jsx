import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { ErrorPage } from "./components/ErrorPage";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
  UserButton,
} from "@clerk/clerk-react";
import { SignInPage } from "./components/SignInPage";

if (!import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY;

// function PublicPage() {
//   return (
//     <>
//       <h1>Public page</h1>
//       <a href="/protected">Go to protected page</a>
//     </>
//   );
// }

function ProtectedPage() {
  return (
    <>
      <h1>Protected page</h1>
      <UserButton />
    </>
  );
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

  {
    /* <div>
          <Header onClick={handleTheme} darkMode={darkMode} />
        </div> */
  }
  const handleTheme = () => {
    setDarkMode(!darkMode);
    console.log("he");
  };
  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
    <div>
          <Header onClick={handleTheme} darkMode={darkMode} />
        </div> 
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      {/* <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}></div>
      
      <Routes>
       
        <Route path="/" exact element={<Home />}></Route>
        <Route path="/sign-in/*" element={<SignedIn />}></Route>
        <Route path="/sign-up/*" element={<SignedOut />}></Route>
        <Route
          path="/"
          element={
            <ClerkProvider navigate={(to) => `/sign-in${to}`}>
              <Home />
            </ClerkProvider>
          }
        ></Route>
        
      </Routes> */}
    <Routes>
 
    </Routes>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/sign-in/*"
          element={<SignInPage />}
        />
        <Route
          path="/sign-up/*"
          element={<SignUp routing="path" path="/sign-up" />}
        />
        <Route
          path="/protected"
          element={
            <>
              <SignedIn>
                <ProtectedPage />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route path="*" element={<ErrorPage />}></Route>
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
