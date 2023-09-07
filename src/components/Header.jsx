import React, { useState, useEffect, useRef } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { Button } from "./Button";
import { RiCloseCircleFill } from "react-icons/ri";
import { LuMoon } from "react-icons/lu";
import { BsSun } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { UserButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export const Header = (props) => {
  const [active, setActive] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate()
  const { user } = useUser();

  const profileUrl = user ? `/profile/${user.id}` : null;

   

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
  }, [menuRef]);

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
      className={`header fixed px-2 h-[5rem] sm:px-4 py-2 md:py-2.5 z-20 top-0 left-0 box-shadow w-full flex items-center ${
        active ? "blur-active" : ""
      }`}
    >
      <div className="wrapper flex flex-wrap items-center justify-between mx-auto">
        <div className="mobile-nav-container w-[40%] sm:w-[30%] md:w-[75%] lg:w-[80%] lg:justify-between md:justify-start flex justify-between items-center">
          <div
            className="mobile-menu-icon lg:hidden md:mr-8"
            onClick={handleNavbar}
          >
            <RiMenu3Line className="text-[24px] menu-icon-svg lg:hidden lg:absolute" />
          </div>

          <div className="flex justify-between">
            <div className="">
              <Link
                to="/"
                className="site-title flex items-center text-[1.125rem] md:text-[24px] md:ml-0 font-bold leading-normal poppins"
              >
                <span>Bookbay</span>
              </Link>
            </div>

            <ul className="hidden ml-[13.4rem] lg:flex gap-8 md:items-center lg:ml-[12rem] leading-normal items-center lg:w-[70%] xl:ml-[16rem] text-[0.875rem]">
              <li className="roboto under text-[18px] leading-normal">
                <NavLink to="/" style={navLinkStyle}>
                  Home
                </NavLink>
              </li>
              <li className="roboto under text-[18px] leading-normal">
                <NavLink to="about-us" style={navLinkStyle}>
                  About us
                </NavLink>
              </li>
              <li className="roboto under text-[18px] leading-normal">
                <NavLink to="/borrow" style={navLinkStyle}>
                  Borrow
                </NavLink>
              </li>
              <li className="roboto under text-[18px] leading-normal">
                <NavLink to="/buy" style={navLinkStyle}>
                  Buy/Sell
                </NavLink>
              </li>
              <li className="roboto under text-[18px] leading-normal balance">
                <NavLink to="/connect-wallet" style={navLinkStyle}>
                  Wallet connect
                </NavLink>
              </li>
            </ul>
          </div>
          {/* Desktop View */}

          <div></div>
        </div>

        {/* Add Login Button */}
        <div className="login-button-container border-3 flex justify-between items-center">
          <div className="flex items-center md:w-[100%] w-[60%] justify-between">
            <div className="">
              {props.darkMode ? (
                <BsSun
                  onClick={props.onClick}
                  className="icon cursor-pointer h-[1.2rem] w-[1.2rem] md:h-[1.5rem] md:w-[1.5rem]"
                />
              ) : (
                <LuMoon
                  onClick={props.onClick}
                  className="cursor-pointer h-[1.2rem] w-[1.2rem] md:h-[1.5rem] md:w-[1.5rem]"
                />
              )}
            </div>
           {user ?  ( <div className="flex items-center justify-between">
            <UserButton afterSignOutUrl="/" className="user-btn"/>
            <Link to={profileUrl}>profile</Link>
           </div>) : <Button
            onClick={() => navigate("/sign-in")}
              value="Login"
              cls_name=" text-[0.825rem] btn md:text-[1.25rem] rounded-[6px] bg bg-transparent border-2 border-[#0F9D58] text-[#008C45] py-[0.1875rem] ml-[10px] md:ml-[10px] px-[0.75rem] md:px-[1.86519rem] roboto md:py-[0.46631rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.49744rem]"
            />}
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
          } h-screen overflow-hidden transition-all duration-300 ease-in-out z-10 absolute top-0 left-0 aside lg:hidden`}
        >
          {active && (
            <RiCloseCircleFill
              onClick={handleNavbar}
              className="close mt-7 right-4 cursor-pointer font-medium text-[40px] leading-5 not-italic absolute"
            />
          )}
          <ul className="p-4 mt-20 w-[80%] ml-8">
            <li className="mb-5 text-[25px] font-medium leading-[120%] hover:underline">
              <NavLink
                to="/"
                onClick={() => {
                  setActive(false);
                }}
                className=""
              >
                Home
              </NavLink>
            </li>
            <li className="mb-5 text-[25px] font-medium leading-[120%] hover:underline">
              <NavLink
                to="/about-us"
                onClick={() => {
                  setActive(false);
                }}
                className=""
              >
                About
              </NavLink>
            </li>
            <li className="mb-5 text-[25px] font-medium leading-[120%] hover:underline">
              <NavLink
                to="/borrow"
                onClick={() => {
                  setActive(false);
                }}
                className=""
              >
                Borrow
              </NavLink>
            </li>
            <li className="mb-5 text-[25px] font-medium leading-[120%] hover:underline">
              <NavLink
                to="/buy"
                onClick={() => {
                  setActive(false);
                }}
                className=""
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
