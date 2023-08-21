import React from "react";
import "./App.css";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import { Header2 } from "./components/Header";
import { Home } from "./components/Home";
import { Borrow } from "./components/Borrow";
import { Buy } from "./components/Buy";
import { About } from "./components/About";
import { WalletConnect } from "./WalletConnect";
import { Hero } from "./components/Hero";
function App() {
  return (
    <Router>
      <div>
        <Header2 />
      </div>
      
     <Routes>
     <Route path="/" exact element={<Home />}></Route>
      <Route path="/about"  element={<About />}></Route>
      <Route path="/buy"  element={<Buy />}></Route>
      <Route path="/borrow"  element={<Borrow />}></Route>
      <Route path="/wallet-coonect"  element={<WalletConnect />}></Route>
      <Route path="/hero"  element={<Hero />}></Route>
     </Routes>
    </Router>
  );
}

export default App;
