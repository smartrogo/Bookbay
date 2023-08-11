import React, { useState, useEffect, useRef } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { Button } from "./Button";
import { RxCross1 } from "react-icons/rx";

export const Header2 = () => {
  const [active, setActive] = useState(false);
  const menuRef = useRef();

  const handleNavbar = () => {
    setActive(!active);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className={`bg-[#FFFFFF] fixed px-2 h-[5rem] border-2 border-red-600 sm:px-4 py-2.5 z-20 top-0 left-0 border-b shadow-md w-full text-white flex items-center ${active ? 'blur-active' : ''}`}>
      <div className="container border-2 border-green-500 flex flex-wrap items-center justify-between mx-auto">
        <div className="mobile-nav-container flex justify-between items-center border-2 border-yellow-400 w-[36%] md:w-[40%]">
          <div className="mobile-menu-icon" onClick={handleNavbar}>
            <RiMenu3Line className=" text-[#000000] text-[1.5rem] menu-icon-svg md:hidden md:absolute" />
          </div>
          <a href="/" className="site-title text-[1.2rem] text-[#000000] font-bold leading-normal">
            Bookbay
          </a>

          {/* Desktop View */}
          <ul className="hidden md:flex gap-8 border-2 uppercase text-white">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Add Login Button */}
        <div className="login-button-container flex w-[50%] text-sm border-2 border-white justify-between md:justify-end items-center">
          <div>
            <a href="/contact" className=" leading-normal font-bold text-[0.44769rem] poppins underline text-[#000000] md:mr-10">
              Connect with wallet
            </a>
          </div>
          <div className="md:mr-24">
            <Button value="Login" cls_name=" rounded-[2.48719rem] bg-[#6750A4] py-2 px-4"/>
          </div>
        </div>

        <ul
          ref={menuRef}
          className={`mobile-menu ${
            active ? "w-[60%]" : "w-0"
          } h-screen overflow-hidden transition-all duration-300 ease-in-out absolute top-0 left-0 bg-black/50 backdrop-blur-sm sm:hidden`}
        >
          {active && (
            <RxCross1
              onClick={handleNavbar}
              className="close mt-7 right-0 text-white font-medium text-[25px] leading-5 not-italic absolute"
            />
          )}
          <ul className="p-4">
            <li className="mb-4">
              <a
                href="/"
                className="text-white font-medium text-lg hover:underline"
              >
                Home
              </a>
            </li>
            <li className="mb-4">
              <a
                href="/about"
                className="text-white font-medium text-lg hover:underline"
              >
                About
              </a>
            </li>
            <li className="mb-4">
              <a
                href="/contact"
                className="text-white font-medium text-lg hover:underline"
              >
                Contact Us
              </a>
            </li>
          </ul>
          <div className="flex justify-end">
            <Button primaryGreen="#0f9d58" />
          </div>
        </ul>
      </div>
    </div>
  );
};
