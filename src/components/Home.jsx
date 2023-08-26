import React from "react";
import { Hero } from "./Hero";
import { useRef } from "react";
import { useState } from "react";
import { SecondSec } from "./SecondSec";
import { MiniSwipper } from "./MiniSwipper";
import { Reasons } from "./Reasons";
import { Testimony } from "./Testimony";
import { Blogs } from "./Blogs";

export const Home = () => {
  const menuRef = useRef();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-red-[#FFF] relative min-h-[100vh] w-full overflow-x-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[9999]"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <Hero className="border-2 border-red-500" menuRef={menuRef} isSidebarOpen={isSidebarOpen} />
    <SecondSec />
    {/* <Categories /> */}
    <MiniSwipper />
    <Reasons />
    <Testimony />
    <Blogs />

    </div>
  );
};
