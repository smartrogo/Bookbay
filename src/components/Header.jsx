import React, { useState, useEffect, useRef } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { Button } from "./Button";
import { RxCross1 } from "react-icons/rx";
import {LuArrowUpRight} from "react-icons/lu"
import {LuMoon} from "react-icons/lu"

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
    <section
      className={`bg-[#F4F4F4] fixed px-2 h-[4rem] sm:px-4 py-2.5 z-20 top-0 left-0 border-b shadow-md w-full text-white flex items-center ${
        active ? "blur-active" : ""
      }`}
    >
      <div className="container flex flex-wrap border-2  items-center justify-between mx-auto">
        <div className="mobile-nav-container border-2 border-yellow-500 md:w-[53%] flex justify-between items-center">
          <div className="mobile-menu-icon md:hidden" onClick={handleNavbar}>
            <RiMenu3Line className=" text-[#000000] dark:text-[#F4F4F4] text-[1.5rem] menu-icon-svg md:hidden md:absolute" />
          </div>
          <a
            href="/"
            className="site-title text-[1.1rem] md:ml-0 text-[#000000] font- leading-normal"
          >
            Bookbay
          </a>

          {/* Desktop View */}
          <ul className="hidden md:flex gap-8 border-2 leading-normal text-[0.875rem] text-[#000000]">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Borrow
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Buy/Sell
              </a>
            </li>
          </ul>
        </div>

        {/* Add Login Button */}
        <div className="login-button-container w-[30%] flex border-red-500 border-2 ">
          <div className="border-2">

            <a
              href="/contact"
              className=" leading-normal font-bold text-[0.6rem] poppins underline text-[#000000] mr-4 "
            >
              Connect with wallet <LuArrowUpRight />
            </a>
          </div>
          <div className="border-2">
            <Button
              value="Login"
              cls_name=" rounded-[6px] bg-[#0F9D58] py-[8px] px-4 "
            />
          </div>
        </div>

        <ul
          ref={menuRef}
          className={`mobile-menu ${
            active ? "w-[65%]" : "w-0"
          } h-screen overflow-hidden transition-all text-[#000000] dark:[#F4F4F4] duration-300 ease-in-out absolute top-0 left-0 bg-white/80 backdrop-blur-sm [#3B383E] sm:hidden`}
        >
          {active && (
            <RxCross1
              onClick={handleNavbar}
              className="close z-20 mt-7 right-0 font-medium text-[25px] leading-5 not-italic absolute"
            />
          )}
          <ul className="p-4 mt-20">
            <li className="mb-4">
              <a href="/" className="font-medium text-lg hover:underline">
                Home
              </a>
            </li>
            <li className="mb-4">
              <a href="/about" className="font-medium text-lg hover:underline">
                About
              </a>
            </li>
            <li className="mb-4">
              <a
                href="/contact"
                className="font-medium text-lg hover:underline"
              >
                Contact Us
              </a>
            </li>
          </ul>
          <React.Fragment className="flex justify-end">
            <Button primaryGreen="#0f9d58" />
          </React.Fragment>
        </ul>
      </div>
    </section>
  );
};
