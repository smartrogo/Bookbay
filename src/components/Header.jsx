import React, { useState, useEffect, useRef } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { Button } from "./Button";
import { RxCross1 } from "react-icons/rx";
import { LuMoon } from "react-icons/lu";
import { NavLink } from "react-router-dom";
export const Header2 = () => {
  const [active, setActive] = useState(false);
  const menuRef = useRef();

  // sidebar toggle function
  const handleNavbar = () => {
    setActive(!active);
  };

  // useEffect function to handle outside click to toggle
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

  // active page indicator
  const navLinkStyle = ({ isActive }) => {
    return {
      textDecoration: isActive ? "underline" : "none",
      textDecorationColor: isActive ? "#0F9D58" : "none",
      textDecorationThickness: isActive ? "2px" : "0px",
      textUnderlineOffset: isActive ? "0.3em" : "none",
      color: isActive ? "#0F9D58" : "",
    };
  };

  return (
    <section
      className={`bg-[#fff] fixed px-2 h-[5rem] sm:px-4 py-2.5 z-20 top-0 left-0 border-b box-shadow w-full text-white flex items-center ${
        active ? "blur-active" : ""
      }`}
    >
      <div className="wrapper border-2 border-red-500 flex flex-wrap items-center justify-between mx-auto">
        <div className="mobile-nav-container w-[34%] md:w-[75%] border-2 flex justify-between items-center">
          <div className="mobile-menu-icon md:hidden" onClick={handleNavbar}>
            <RiMenu3Line className=" text-[#000000] text-[1.5rem] menu-icon-svg md:hidden md:absolute" />
          </div>

          <div className="flex justify-between border-2 border-red-500">
            <div className="border-2 ">
              <a
                href="/"
                className="site-title flex items-center text-[24px] md:ml-0 text-[#000] font-bold leading-normal poppins"
              >
                <span>Bookbay</span>
              </a>
            </div>

            <ul className="hidden ml-[13.4rem] border-2 border-green-500 md:flex gap-8 leading-normal items-center text-[0.875rem] text-[#000000]">
              <li className="roboto under text-[18px] leading-normal">
                <NavLink to="/" style={navLinkStyle}>
                  Home
                </NavLink>
              </li>
              <li className="roboto under text-[18px] leading-normal">
                <NavLink to="/about" style={navLinkStyle}>
                  About us
                </NavLink>
              </li>
              <li className="roboto under text-[18px] leading-normal">
                <NavLink to="/borrow" style={navLinkStyle}>
                  Borrow
                </NavLink>
              </li>
              <li className="roboto under text-[18px] leading-normal">
                <NavLink to="/buy/sell" style={navLinkStyle}>
                  Buy/Sell
                </NavLink>
              </li>
              <li className="roboto under text-[18px] leading-normal">
                <NavLink to="/buy/sell" style={navLinkStyle}>
                  Wallet connect
                </NavLink>
              </li>
            </ul>
          </div>
          {/* Desktop View */}

          <div></div>
        </div>

        {/* Add Login Button */}
        <div className="login-button-container border-2 flex justify-between items-center">
          <div className="flex items-center w-[48%] justify-between">
            <div className="">
              <LuMoon className="text-[#000000] cursor-pointer h-[1.5rem] w-[1.5rem]" />
            </div>
            <Button
              value="Login"
              cls_name=" rounded-[6px] bg bg-transparent border-2 border-[#0F9D58] py-[8px] md:px-[1.86519rem] roboto text-[#0F9D58] md:py-[0.46631rem] text-center flex items-center px-4 "
            />
          </div>

          <div className="">
            {/* <button className="rounded-[5px] flex items-center text-[14px] bg-[#0F9D58] px-2 font-medium md:px-4 text-center py-1 md:py-[4px]">
              {<LuLogIn className="mt-1 mr-1 font-black text-[14px]" />}Login
            </button> */}
          </div>
        </div>

        <ul
          ref={menuRef}
          className={`mobile-menu ${
            active ? "w-[70%]" : "w-0"
          } h-screen overflow-hidden transition-all text-[#000000] dark:[#F4F4F4] duration-300 ease-in-out absolute top-0 left-0 bg-white/80 backdrop-blur-sm [#3B383E] sm:hidden`}
        >
          {active && (
            <RxCross1
              onClick={handleNavbar}
              className="close z-20 mt-7 border-2 border-blue-500 right-4 cursor-pointer font-medium text-[25px] leading-5 not-italic absolute"
            />
          )}
          <ul className="p-4 mt-20">
            <li className="mb-4">
              <NavLink to="/" className="font-medium text-lg hover:underline">
                Home
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/about"
                onClick={() => {
                  setActive(false);
                }}
                className="font-medium text-lg hover:underline"
              >
                About
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/borrow"
                onClick={() => {
                  setActive(false);
                }}
                className="font-medium text-lg hover:underline"
              >
                Borrow
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/buy/sell"
                onClick={() => {
                  setActive(false);
                }}
                className="font-medium text-lg hover:underline"
              >
                Buy/Sell
              </NavLink>
            </li>
          </ul>
          <div className="flex justify-end">
            <Button primaryGreen="#0f9d58" />
          </div>
        </ul>
      </div>
    </section>
  );
};
