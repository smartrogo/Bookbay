import React, { useState, useEffect, useRef } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { Button } from "./Button";
import { RiCloseCircleFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { GrCart } from "react-icons/gr";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { PiSignOutBold } from "react-icons/pi";
import { AiFillSetting, AiOutlineArrowRight } from "react-icons/ai";
import { db } from "../firebase";
import { atom, useAtom } from "jotai";

export const cartItems = atom([]);

export const Header = (props) => {
  const [active, setActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isManageAccountOpen, setIsManageAccountOpen] = useState(false); // State to control "Manage Account" content
  const menuRef = useRef();
  const navigate = useNavigate();
  const [cartAtom, setCartAtom] = useAtom(cartItems);
  const { userData, isAuth, isLoading, logOut, deleteUserAccount } = useContext(AuthContext);
  const [myCartBooks, setMyCartBooks] = useState([]);
  const [loadingAvatar, setLoadingAvatar] = useState(false);


  const getMyBooks = async () => {
    if (userData && userData.email) {
      const q = query(
        collection(db, "cart"),
        where("email", "==", userData.email)
      );
      const querySnapshot = await getDocs(q);
      let res = [];
      querySnapshot.forEach((doc) => {
        res = [...res, { ...doc.data(), id: doc.id }];
        const total = res.length;
        console.log(total);
      });
      setCartAtom(res);
      console.log(res.length);
    }
  };

  useEffect(() => {
    getMyBooks();
  }, []);

  useEffect(() => {
    // Close the menu when a user logs in
    setIsMenuOpen(false);
  }, [isAuth]);

  // sidebar toggle function
  const handleNavbar = () => {
    setActive(!active);
  };

  // useEffect function to handle outside click to toggle
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActive(false);
        setIsMenuOpen(false);
        // Close "Manage Account" content here if needed
        setIsManageAccountOpen(false);
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
      textDecorationColor: isActive ? "#31af31" : "none",
      textDecorationThickness: isActive ? "2px" : "0px",
      textUnderlineOffset: isActive ? "0.3em" : "none",
      color: isActive ? "#31af31" : "",
    };
  };

  const signingOut = () => {
    setIsMenuOpen(false);
    logOut();
  };

  const handleCartNavigate = () => {
    navigate("/cart")
    setIsMenuOpen(false)
  }

  const handleDeleteUser = () => {
    setIsMenuOpen(false);
    deleteUserAccount()
  }
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close "Manage Account" content here if needed
    setIsManageAccountOpen(false); // Reset "Manage Account" content when the menu is opened
  };

  return (
    <section
    className={`header bg-[#FFF] fixed px-2 h-[5rem] sm:px-4 py-2 md:py-2.5 z-20 top-0 left-0 box-shadow w-full flex items-center ${
      active ? "blur-active" : ""
    }`}
  >
    <div className="wrapper flex items-center justify-between mx-auto">
      <div className="mobile-nav-container lg:justify-between md:justify-start flex gap-2 sm:gap-4 items-center">
        <div className="mobile-menu-icon lg:hidden" onClick={handleNavbar}>
          <RiMenu3Line className="text-[24px] menu-icon-svg lg:hidden lg:absolute" />
        </div>

        <div className="flex justify-between">
          <div className="">
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
        </div>
      </div>

      <div className="login-button-container flex justify-between items-center">
        <div className="flex gap-7 lg:gap-[8rem] xl:gap-[20rem] 2xl:gap-[30rem] items-center md:w-[] justify-between">
          <ul className="hidden text-[#000000] lg:flex gap-8 md:items-center leading-normal items-center text-[0.875rem]">
            <li className="poppins font-normal text-style under text-[1.125rem] leading-normal">
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
                Buy
              </NavLink>
            </li>
            <li className="roboto font-normal text-style under text-[1.125rem] leading-normal">
              <NavLink to="/sell" style={navLinkStyle}>
                Sell
              </NavLink>
            </li>
          </ul>

          {isLoading ? (
            <span>loading</span>
          ) : isAuth ? (
            <div className="flex items-center md:ml-[6rem] lg:ml-[3px] xl:ml-[1rem] first-letter: justify-between gap-4 md:gap-8">
              <Link to="/cart">
                <div className="relative  ">
                  <GrCart className="text-red-500 cursor-pointer w-[1.5rem] h-[1.5rem]" />

                  <div className="absolute -top-2 left-4">
                    <span className="flex h-[0.3rem] w-[0.3rem] items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                      {cartAtom.length}
                    </span>
                  </div>
                </div>
              </Link>

              <button onClick={toggleMenu}>
                {loadingAvatar ? (
                  <span>Loading</span>
                ) : userData?.pic ? (
                  <img
                    src={userData?.pic}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <img
                    src={`https://ui-avatars.com/api/?name=${userData?.email.split("@")[0].slice(0, 2)}`}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-[6px] sm:gap-3">
              <Button
                onClick={() => navigate("/connect-wallet")}
                value="connect wallet"
                cls_name="text-[0.80rem] btn md:text-[1rem] bg-[#0000FF] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"
              />
              <Link
                to="sign-in"
                className="text-[#0F9D58] poppins md:text-[1rem] text-[0.65rem] text-style font-medium leading-[0.49744rem] md:leading-[0.62181rem]"
              >
                Log in
              </Link>
            </div>
          )}
        </div>

        <div className=""></div>
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
              Buy
            </NavLink>
          </li>
          <li className="mb-5 text-[25px] font-medium leading-[120%] hover:underline">
            <NavLink
              to="/sell"
              onClick={() => {
                setActive(false);
              }}
              className=""
            >
              Sell
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
    {isAuth && isMenuOpen && (
      <div ref={menuRef} className="bg-white fixed top-20 right-4 p-6 usershd rounded-[1rem] w-[20rem] md:w-[26.1875rem] ">
        {userData?.pic ? (
          <div className="flex border-2 border-green-500 items-center justify-center">
            {isManageAccountOpen ? <div>
              <h1>manage account</h1>
              </div> : null}
            <img
              src={userData?.pic}
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        ) : (
          <div className="border-b-[3px] pb-4 border-[#DBDBDB] flex items-center gap-2 md:gap-4 ">
            <img
              src={`https://ui-avatars.com/api/?name=${userData?.email.split("@")[0].slice(0, 2)}`}
              alt="profile"
              className="w-[4rem] h-[4rem] md:w-[5rem] md:h-[5rem] rounded-full"
            />
            <p className="text-[1rem] font-medium leading-normal text-style text-[#1f1f1f]">
              {userData?.displayName || null}
            </p>
            <p className="text-[#333] text-[0.75rem] font-normal leading-normal">
              {userData?.email}
            </p>
          </div>
        )}

        <div className="flex flex-col my-4">
          <div className="">
            {isManageAccountOpen ? (

              <div>
                <div className="my-4">
                <p>Email</p>
                <span>{userData?.email}</span><br/>
                <span className="text-[#0000FF]">+ Add Email Address</span>

                </div >
                <div className="my-4">
                <p>Phone Number</p>
                <span>{userData?.email}</span><br/>
                <span className="text-[#0000FF]">Edit phone number</span>

                </div>
                <div className="my-4">
                <p>Password</p>
                <span>{userData?.email}</span><br/>
                <span className="text-[#0000FF]">change Password</span>

                </div>

                <div className="flex justify-evenly mt-14 mb-8">
                  <Button value="Delete Account" onClick={handleDeleteUser}  cls_name="text-[0.80rem] btn md:text-[1rem] bg-[#C5221F] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"/>
                  <Button value="View Cart" onClick={handleCartNavigate} cls_name="text-[0.80rem] btn md:text-[1rem] bg-[#0000FF] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"/>
                </div>

               <div className="border-2 flex justify-end">
               <button className="" onClick={() => setIsManageAccountOpen(false)}>
                <div className="flex gap-2 items-center text-[#333] text-[1rem] text-style font-normal leading-normal">
                 Go Back <AiOutlineArrowRight />
                </div>
              </button>
               </div>


              </div>

            ) : (
              <button className="mx-auto" onClick={() => setIsManageAccountOpen(true)}>
                <div className="flex gap-4 items-center text-[#333] text-[1rem] text-style font-normal leading-normal">
                  <AiFillSetting />
                  Manage Account
                </div>
              </button>
            )}
          </div>
          {!isManageAccountOpen && (
            <div>
              <button className="mx-auto" onClick={() => signingOut()}>
                <div className="flex gap-4 items-center text-[#333] text-[1rem] text-style font-normal leading-normal">
                  <PiSignOutBold />
                  Sign out
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    )}
  </section>
  );
};
