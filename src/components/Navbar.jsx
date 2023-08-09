import React, { useState } from "react";
import {BiMoon} from "react-icons/bi";
import { Button } from "./Button";

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const closeNavbar = () => {
    setNavbarOpen(false);
  };

  return (
    <div className="">
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between border-2 border-white h-16">

            <div className=" flex justify-between w-[45%] border-2">
              <div className="flex items-center border-2 border-red-500">
                <div className="flex-shrink-0 text-white">bookbay</div>
              </div>

              <div className="hidden md:block border-2 border-red-500">
                <div className="ml-4 flex items-center space-x-4">
                  <a href="#" className="text-gray-300 hover:text-white">
                    Home
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white">
                    About Us
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Borrow
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Buy/Sell
                  </a>
                </div>
              </div>
            </div>

            <div className="border-2 w-[45%] flex">
                <div>
                    <BiMoon className="text-white"/>
                </div>

                <span className="text-white">connect with your wallet</span>
                <Button />

            </div>

            <div className="md:hidden">
              <button
                onClick={toggleNavbar}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {navbarOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {navbarOpen && (
          <div className="md:hidden bg-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="text-gray-300 hover:text-white block">
                Home
              </a>
              <a href="#" className="text-gray-300 hover:text-white block">
                About
              </a>
              <a href="#" className="text-gray-300 hover:text-white block">
                Services
              </a>
              <a href="#" className="text-gray-300 hover:text-white block">
                Contact
              </a>
            </div>
          </div>
        )}
      </nav>
      <div
        onClick={closeNavbar}
        className={`flex-grow md:hidden ${navbarOpen ? "block" : "hidden"}`}
      />
    </div>
  );
};

export default Navbar;
