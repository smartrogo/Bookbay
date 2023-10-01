import React, { useState, useEffect, useRef } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { Button } from "./Button";
import { RiCloseCircleFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { UserButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { GrCart } from "react-icons/gr"

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
      textDecorationColor: isActive ? "#00FF00" : "none",
      textDecorationThickness: isActive ? "2px" : "0px",
      textUnderlineOffset: isActive ? "0.3em" : "none",
      color: isActive ? "#00FF00" : "",
    };
  };

  return (
    <section
      className={`header bg-[#FFF] fixed px-2 h-[5rem] sm:px-4 py-2 md:py-2.5 z-20 top-0 left-0 box-shadow w-full flex items-center ${
        active ? "blur-active" : ""
      }`}
    >
      <div className="wrapper flex items-center justify-between mx-auto">
        <div className="mobile-nav-container lg:justify-between md:justify-start flex gap-2 sm:gap-4 items-center">
          <div
            className="mobile-menu-icon lg:hidden"
            onClick={handleNavbar}
          >
            <RiMenu3Line className="text-[24px] menu-icon-svg lg:hidden lg:absolute" />
          </div>

          <div className="flex justify-between">
            <div className="">
              <Link
                to="/"
                className="site-title flex items-center text-[1.125rem] md:text-[24px] font-bold leading-normal poppins"
              >
                <img className="w-[8rem] h-[2rem] md:w-[9.42544rem] md:h-[2.5625rem]" src={logo} alt="logo" />
              </Link>
            </div>


          </div>
          {/* Desktop View */}

        </div>

        {/* Add Login Button */}
        <div className="login-button-container flex justify-between items-center">
          <div className="flex gap-8 items-center justify-between">

          <ul className="hidden text-[#000000] lg:flex gap-8 md:items-center leading-normal items-center text-[0.875rem]">
              <li className="roboto font-normal text-style under text-[1.125rem] leading-normal">
                <NavLink to="/" style={navLinkStyle}>
                  Home
                </NavLink>
              </li>
              <li className="roboto font-normal text-style under text-[1.125rem] leading-normal">
                <NavLink to="about-us" style={navLinkStyle}>
                  About us
                </NavLink>
              </li>
              <li className="roboto font-normal text-style under text-[1.125rem] leading-normal">
                <NavLink to="/borrow" style={navLinkStyle}>
                  Borrow
                </NavLink>
              </li>
              <li className="roboto font-normal text-style under text-[1.125rem] leading-normal">
                <NavLink to="/buy" style={navLinkStyle}>
                  Buy/Sell
                </NavLink>
              </li>
            </ul>


           {user ?  ( <div className="flex items-center md:ml-[6rem] lg:ml-[8rem] xl:ml-[14rem] justify-between gap-2 md:gap-4">

            <GrCart className="text-red-500 cursor-pointer w-[1.36119rem] h-[1.20313rem]"/>

            <UserButton afterSignOutUrl="/" className="user-btn"/>

            <Link className="text-[#000] text-[0.8rem] md:text-[1rem] poppins font-normal text-stlye leading-[0.49744rem] capitalize" to={profileUrl}>Hi, {user.firstName}</Link>

           </div>) : <div className="flex items-center gap-[6px] sm:gap-3">

           <Button
            onClick={() => navigate("/connect-wallet")}
              value="connect wallet"
              cls_name="text-[0.80rem] btn md:text-[1rem] bg-[#0000FF] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"
            />
            <Link to="sign-in" className="text-[#0F9D58] poppins md:text-[1rem] text-[0.65rem] text-style font-medium leading-[0.49744rem] md:leading-[0.62181rem]">log in</Link>
            </div>}
          </div>

          <div className="">
          </div>
          
        </div>

        <ul
          ref={menuRef}
          className={`mobile-menu ${
            active ? "w-[70%]" : "w-0"
          } h-screen overflow-hidden transition-all duration-300 ease-in-out z-10 absolute top-0 left-0 bg-[#f1eeee] lg:hidden`}
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
            <li className="mb-5 text-[25px] font-medium leading-[120%] hover:underline">
              <NavLink
                to="/connect-wallet"
                onClick={() => {
                  setActive(false);
                }}
                className=""
              >
               Wallet Connect
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
