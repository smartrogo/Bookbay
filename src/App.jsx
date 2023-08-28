import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { Borrow } from "./components/Borrow";
import { Buy } from "./components/Buy";
import { About } from "./components/About";
import { WalletConnect } from "./WalletConnect";
import { Hero } from "./components/Hero";
import ThumbnailCarousel from "./components/ThumbnailCarousel ";
import { ErrorPage } from "./components/ErrorPage";

function App() {
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
    console.log("he");
  };
  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Router>
        <div>
          <Header onClick={handleTheme} darkMode={darkMode}/>
        </div>

        <Routes>
          <Route path="/" exact element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/buy" element={<Buy />}></Route>
          <Route path="/borrow" element={<Borrow />}></Route>
          <Route path="/wallet-coonect" element={<WalletConnect />}></Route>
          <Route path="/hero" element={<Hero />}></Route>
          <Route path="/thumb" element={<ThumbnailCarousel />}></Route>
          <Route path="*" element={<ErrorPage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
