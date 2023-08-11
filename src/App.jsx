import React from "react";
import "./App.css";
// import Navbar from "./components/Navbar";
import { Header2 } from "./components/Header";

function App() {
  return (
    <div className="[#FFFFFF] dark:bg-[#3B383E] h-screen flex flex-col">
      {/* <Navbar /> */}
      <Header2 />
      <h1 className="text-center mt-20 text-green-600 underline text-2xl">
        HELLO FROM BOOKBAY APP!
      </h1>
      <h1 className="text-center text-white">buy, sell and borrow books online</h1>
    </div>
  );
}

export default App;
