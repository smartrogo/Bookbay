import React, { useState, useEffect, useRef, useContext } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { Button } from "./Button";
import { NavLink, useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { GrCart } from "react-icons/gr";
import { AuthContext } from "../AuthContext";
import { useAtom } from "jotai";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from "react-redux";
import { clearUserId } from "../store/actions/userAction";
import { fetchCartItems } from "../services/bookService";
import { cartItems, isLoadingCartItems } from "../store/cartAtoms";

export const Header = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartAtom, setCartAtom] = useAtom(cartItems);
  const [, setIsLoadingCart] = useAtom(isLoadingCartItems);
  const menuRef = useRef();
  const navigate = useNavigate();
  const { userData, isAuth, isLoading, isAdmin, logOut } = useContext(AuthContext);
  const currentUserId = userData?.id || userData?.userId;

  useEffect(() => {
    const loadCartItems = async () => {
      if (!currentUserId) {
        setCartAtom([]);
        setIsLoadingCart(false);
        return;
      }

      setIsLoadingCart(true);
      try {
        const items = await fetchCartItems(currentUserId);
        setCartAtom(items);
      } catch (error) {
        console.error("Error loading header cart:", error);
      } finally {
        setIsLoadingCart(false);
      }
    };

    loadCartItems();
  }, [currentUserId, setCartAtom, setIsLoadingCart]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [isAuth]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActive(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleNavbar = () => {
    setActive(!active);
  };

  const handleCartNavigate = () => {
    navigate("/cart");
    setIsMenuOpen(false);
  };

  const signingOut = () => {
    setIsMenuOpen(false);
    dispatch(clearUserId());
    logOut();
  };

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: isActive ? "underline" : "none",
    textDecorationColor: isActive ? "#31af31" : "none",
    textDecorationThickness: isActive ? "2px" : "0px",
    textUnderlineOffset: isActive ? "0.3em" : "none",
    color: isActive ? "#31af31" : "",
  });

  return (
    <section
      className={`header bg-[#FFF] fixed px-2 h-[5rem] sm:px-4 py-2 md:py-2.5 z-20 top-0 left-0 box-shadow w-full flex items-center ${
        active ? "blur-active" : ""
      }`}
    >
      <div className="wrapper flex items-center justify-between mx-auto w-full">
        <div className="flex items-center gap-4">
          <div className="mobile-menu-icon lg:hidden" onClick={handleNavbar}>
            <RiMenu3Line className="text-[24px] menu-icon-svg" />
          </div>

          <Link
            to="/"
            className="site-title flex items-center text-[1.125rem] md:text-[24px] font-bold leading-normal poppins"
          >
            <img
              className="w-[8rem] h-[2rem] md:w-[9.42544rem] md:h-[2.5625rem]"
              src={logo}
              alt="logo"
            />
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <ul className="hidden lg:flex gap-8 items-center text-[0.875rem] text-[#000000]">
            <li className="poppins font-normal text-style text-[1.125rem] leading-normal">
              <NavLink to="/" style={navLinkStyle}>
                Home
              </NavLink>
            </li>
            <li className="roboto font-normal text-style text-[1.125rem] leading-normal">
              <NavLink to="/about-us" style={navLinkStyle}>
                About us
              </NavLink>
            </li>
            <li className="roboto font-normal text-style text-[1.125rem] leading-normal">
              <NavLink to="/borrow" style={navLinkStyle}>
                Borrow
              </NavLink>
            </li>
            <li className="roboto font-normal text-style text-[1.125rem] leading-normal">
              <NavLink to="/buy" style={navLinkStyle}>
                Buy
              </NavLink>
            </li>
            <li className="roboto font-normal text-style text-[1.125rem] leading-normal">
              <NavLink to="/sell" style={navLinkStyle}>
                Sell
              </NavLink>
            </li>
            {isAuth && (
              <li className="roboto font-normal text-style text-[1.125rem] leading-normal">
                <NavLink to="/wishlist" style={navLinkStyle}>
                  Wishlist
                </NavLink>
              </li>
            )}
            {isAuth && (
              <li className="roboto font-normal text-style text-[1.125rem] leading-normal">
                <NavLink to="/orders" style={navLinkStyle}>
                  Orders
                </NavLink>
              </li>
            )}
            {isAuth && (
              <li className="roboto font-normal text-style text-[1.125rem] leading-normal">
                <NavLink to="/dashboard" style={navLinkStyle}>
                  Dashboard
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li className="roboto font-normal text-style text-[1.125rem] leading-normal">
                <NavLink to="/admin" style={navLinkStyle}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          {isLoading ? (
            <ClipLoader color="#00f" loading={isLoading} size={40} />
          ) : isAuth ? (
            <div className="flex items-center gap-4">
              <button className="relative" onClick={handleCartNavigate}>
                <GrCart className="text-red-500 cursor-pointer w-[1.5rem] h-[1.5rem]" />
                <span className="absolute -top-2 left-4 flex h-[0.3rem] w-[0.3rem] items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                  {cartAtom.length}
                </span>
              </button>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2">
                <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-[#e2e8f0] flex items-center justify-center text-[#000] font-semibold">
                  {userData?.email?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="hidden md:inline-block text-[#000] text-[0.9rem]">{userData?.email || "User"}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/connect-wallet")}
                value="Connect wallet"
                cls_name="text-[0.80rem] btn md:text-[1rem] bg-[#0000FF] rounded-[0.25rem] text-[#FFFFFF] py-[0.5rem] px-[1rem]"
              />
              <Link to="/sign-in" className="text-[#0F9D58] poppins md:text-[1rem] text-[0.75rem] text-style font-medium">
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>

      {isAuth && isMenuOpen && (
        <div
          ref={menuRef}
          className="bg-white fixed top-[5rem] right-4 rounded-[1rem] w-[20rem] md:w-[24rem] p-5 shadow-lg z-50"
        >
          <div className="mb-4">
            <p className="text-[1rem] text-style font-semibold">Account</p>
            <p className="text-[#666] text-[0.9rem] mt-2">{userData?.email}</p>
          </div>
          <div className="flex flex-col gap-3">
            {isAdmin && (
              <Button
                onClick={() => { setIsMenuOpen(false); navigate('/admin'); }}
                value="Admin Dashboard"
                cls_name="text-[0.80rem] btn md:text-[1rem] bg-[#312E81] rounded-[0.25rem] text-[#FFFFFF] py-[0.75rem]"
              />
            )}
            <Button
              onClick={() => { setIsMenuOpen(false); navigate('/wallet'); }}
              value="Wallet"
              cls_name="text-[0.80rem] btn md:text-[1rem] bg-[#0000FF] rounded-[0.25rem] text-[#FFFFFF] py-[0.75rem]"
            />
            <Button
              onClick={() => { setIsMenuOpen(false); navigate('/dashboard'); }}
              value="Dashboard"
              cls_name="text-[0.80rem] btn md:text-[1rem] bg-[#10B981] rounded-[0.25rem] text-[#FFFFFF] py-[0.75rem]"
            />
            <Button
              onClick={handleCartNavigate}
              value="View Cart"
              cls_name="text-[0.80rem] btn md:text-[1rem] bg-[#0000FF] rounded-[0.25rem] text-[#FFFFFF] py-[0.75rem]"
            />
            <Button
              onClick={signingOut}
              value="Sign out"
              cls_name="text-[0.80rem] btn md:text-[1rem] bg-[#C5221F] rounded-[0.25rem] text-[#FFFFFF] py-[0.75rem]"
            />
          </div>
        </div>
      )}
    </section>
  );
};
