import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="bg-gray-900 h-screen flex flex-col">
      <Navbar />
      <h1 className="text-center text-green-600 underline text-2xl">
        HELLO FROM BOOKBAY APP!
      </h1>
      <h1 className="text-center">buy and sell books online</h1>
    </div>
  );
}

export default App;
