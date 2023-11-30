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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MdOutlineEdit } from "react-icons/md";
import { auth, updateProfile } from "../firebase";
import { storage } from "../firebase";
import { PiSignOutBold } from "react-icons/pi";
import { AiFillSetting, AiOutlineArrowRight } from "react-icons/ai";
import { db } from "../firebase";
import { atom, useAtom } from "jotai";
import ClipLoader from "react-spinners/ClipLoader";
import Input from "./Input";
export const cartItems = atom([]);
export const isLoadingCartItems = atom(true);

export const Header = () => {
  const [active, setActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isManageAccountOpen, setIsManageAccountOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [sessionTimeOut, setSessionTimeOut] = useState("");
  const [myNumber, setMyNumber] = useState("");
  const menuRef = useRef();
  const navigate = useNavigate();
  const [cartAtom, setCartAtom] = useAtom(cartItems);
  const [isLoadingcartAtom, setIsLoadingcartAtom] = useAtom(isLoadingCartItems);
  const {
    userData,
    isAuth,
    setUserData,
    isLoading,
    logOut,
    deleteUserAccount,
    ChangePassword,
  } = useContext(AuthContext);

  const [loadingAvatar, setLoadingAvatar] = useState(false);

  useEffect(() => {
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
          // console.log(total);
        });
        setCartAtom(res);
        setIsLoadingcartAtom(false);
        // console.log("right before jotai", res.length);
        console.log(cartAtom);
      }
    };
    getMyBooks();
  }, [userData, setCartAtom, setIsLoadingcartAtom]);

  useEffect(() => {
    const getPhone = async () => {
      if (userData && userData.email) {
        const q = query(
          collection(db, "userDetails"),
          where("email", "==", userData.email)
        );
        try {
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            console.log(doc.data(), "hello phone");
            console.log(doc.data().phone, "hello phone");
            const val = doc.data().phone;
            setMyNumber(val);
          });
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };
    getPhone();
  }, [userData.email]); // Depend only on userData.email

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
        setIsPasswordOpen(false);
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
    navigate("/cart");
    setIsMenuOpen(false);
  };

  const handleDeleteUser = () => {
    setIsMenuOpen(false);
    deleteUserAccount();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close "Manage Account" content here if needed
    setIsManageAccountOpen(false);
    setIsPasswordOpen(false);
  };

  const toggleManageAccount = () => {
    setIsManageAccountOpen(false);
    setIsPasswordOpen(true);
  };

  const toggleMe = () => {
    setIsManageAccountOpen(false);
    setIsPasswordOpen(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsMatching(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setIsMatching(e.target.value === password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === confirmPassword) {
        // Passwords match, try to change the password
        await ChangePassword(password);
        setSessionTimeOut("Password changed successfully");
        setPassword("");
        setConfirmPassword("");
        // Remove the message after 5 seconds
        setTimeout(() => {
          setSessionTimeOut("");
        }, 8000);
      } else {
        // Passwords don't match, show an error message
        setSessionTimeOut("Passwords do not match");
        setTimeout(() => {
          setSessionTimeOut("");
        }, 8000);
      }
    } catch (error) {
      if (error.message === "Please reauthenticate to change your password") {
        setSessionTimeOut("Please log in again to change your password.");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setSessionTimeOut("");
        }, 8000);
      } else {
        // Handle other errors if necessary
        setSessionTimeOut("An error occurred try checking your network");
        setTimeout(() => {
          setSessionTimeOut("");
        }, 8000);
      }
    }
  };

  const handleAvatar = async () => {
    try {
      const avatarInput = document.getElementById("avatarInput");
      avatarInput.click();
    } catch (error) {
      console.error("Error handling avatar click:", error.message);
    }
  };

   const handleAvatarChange = async (e) => {
     try {
       const file = e.target.files[0];
       if (file) {
         setLoadingAvatar(true);

         const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
         await uploadBytes(storageRef, file);

         const avatarURL = await getDownloadURL(storageRef);

         // Update the user's profile with the new avatar URL
         await updateProfile(auth.currentUser, {
           photoURL: avatarURL,
         });

         // Optionally, update the local userData state with the new avatar URL
         setUserData({ ...userData, pic: avatarURL });

         setLoadingAvatar(false);
       }
     } catch (error) {
       console.error("Error changing avatar:", error.message);
       setLoadingAvatar(false);
     }
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
          <div
            className={` ${isLoading && "xl:gap-[24rem] 2xl:gap-[27rem]"} ${
              isAuth && "xl:gap-[20.5rem]"
            } flex gap-7 lg:gap-[8rem] xl:gap-[17rem] 2xl:gap-[30rem] items-center md:w-[] justify-between`}
          >
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
              <div className="">
                <ClipLoader
                  color="#00f"
                  loading={isLoading}
                  size={40}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : isAuth ? (
              <div
                className={`flex items-center md:ml-[6rem] lg:ml-[3px] xl:ml-[1rem] first-letter: justify-between gap-4 md:gap-8`}
              >
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
                  <div className="flex items-center gap-2">
                    <ClipLoader
                      color="#00f"
                      loading={isLoading || loadingAvatar}
                      size={40}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </div>
                  {userData?.pic ? (
                    <img
                      src={userData?.pic}
                      alt="profile"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <img
                      src={`https://ui-avatars.com/api/?name=${userData?.email
                        ?.split("@")[0]
                        ?.slice(0, 2)}`}
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
        <div
          ref={menuRef}
          className={` ${
            isManageAccountOpen &&
            "h-[30rem] sm:h-[31rem] md:h-[33rem] overflow-y-auto"
          } bg-white fixed h-[17rem] top-20 right-4 px-6 pt-10 usershd rounded-[1rem] w-[22rem] md:w-[28.1875rem] ${
            isPasswordChangeOpen && "h-[28rem]"
          }`}
        >
          {isManageAccountOpen ? (
            <div className="mb-10">
              <h1 className="text-[#000000] outfit text-[2.25rem] text-style font-bold capitalize leading-[0.49744rem]">
                Account
              </h1>
              <h1 className="text-[#333] font-normal text-style capitalize leading-[0.49744rem] mt-5 ">
                manage your account
              </h1>
            </div>
          ) : isPasswordChangeOpen ? (
            <div className="mb-8">
              <h1 className="text-[#000000] outfit text-[2.25rem] text-style font-bold capitalize leading-[0.49744rem]">
                Set Password
              </h1>
            </div>
          ) : null}
          {userData?.pic ? (
            <div
              className={`${
                isManageAccountOpen || (isPasswordChangeOpen && "mt-20")
              } items-center justify-center`}
            >
              {isManageAccountOpen && (
                <h1 className="text-[#000] text-[1rem] my-4 md:text-[1.2rem] text-style font-bold leading-[0.49744rem] capitalize">
                  profile
                </h1>
              )}

              <div className="flex relative items-center gap-4">
                {loadingAvatar ? (
                  <ClipLoader
                    color="#00f"
                    loading={loadingAvatar}
                    // cssOverride={override}
                    size={40}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      id="avatarInput"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleAvatarChange}
                    />
                    <MdOutlineEdit
                      className={`absolute top-7 left-10 rounded-full bg-[#e1f3fc] md:left-12 w-[2rem] h-[2rem] md:w-[2rem] md:h-[2rem]`}
                    />

                    <img
                      onClick={handleAvatar}
                      src={userData?.pic}
                      alt="profile"
                      className="w-[4rem] cursor-pointer h-[4rem] rounded-full"
                    />
                  </>
                )}

                <div>
                  <span className="text-[#333] text-[1rem] md:text-[1.2rem] text-style font-semibold leading-normal capitalize">
                    {userData?.displayName || userData?.email}
                  </span>
                  <br />
                  <span>{userData?.email}</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="border-b-[3px] relative pb-4 border-[#DBDBDB] flex items-center gap-2 md:gap-4 ">
                {loadingAvatar ? (
                  <ClipLoader
                    color="#00f"
                    loading={loadingAvatar}
                    // cssOverride={override}
                    size={40}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      id="avatarInput"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleAvatarChange}
                    />
                    <MdOutlineEdit
                      size="rem"
                      className={`absolute bg-[#e1f3fc] top-7 md:left-12 left-10 rounded-full w-[2rem] h-[2rem] md:w-[2rem] md:h-[2rem]`}
                    />

                    <img
                      onClick={handleAvatar}
                      src={`https://ui-avatars.com/api/?name=${userData?.email
                        ?.split("@")[0]
                        ?.slice(0, 2)}`}
                      alt="profile"
                      className="cursor-pointer w-[4rem] h-[4rem] md:w-[5rem] md:h-[5rem] rounded-full"
                    />
                  </>
                )}

                <p className="text-[1rem] font-medium leading-normal text-style text-[#1f1f1f]">
                  {userData?.displayName || null}
                </p>
                <p className="text-[#333] text-[0.75rem] font-normal leading-normal">
                  {userData?.email}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col my-4">
            <div className="transition-opacity duration-300 ease-in-out">
              {isManageAccountOpen ? (
                <div>
                  <div className="my-4">
                    <p className="text-[1.5rem] text-style font-bold capitalize leading-normal">
                      Email
                    </p>
                    <span className="text-[1rem] text-[#0000FF] text-style font-normal leading-normal">
                      {userData?.email}
                    </span>
                    <br />
                    {/* <span className="text-[#0000FF]">+ Add Email Address</span> */}
                  </div>
                  <div className="my-4">
                    <p className="text-[1.5rem] text-style font-bold capitalize leading-normal">
                      Phone Number
                    </p>
                    {myNumber ? (
                      <p className="text-[#0000FF]">{`0${myNumber}`}</p>
                    ) : (
                      <p>loading..</p>
                    )}
                    {/* <p className="text-[#0000FF]">{myNumber}</p> */}
                  </div>
                  <div className="my-4">
                    <p className="text-[1.5rem] text-style font-bold capitalize leading-normal">
                      Password
                    </p>
                    <p>*********</p>
                    <Button
                      onClick={() => toggleManageAccount()}
                      value="+ Change Password"
                      cls_name="w-full  text-[1rem] bg-transparent text-[#00F] text-style font-normal leading-normal hover:bg-[#d7d7f7] text-start"
                    />
                  </div>

                  <div className="flex justify-evenly mt-14 mb-8">
                    <Button
                      value="Delete Account"
                      onClick={handleDeleteUser}
                      cls_name="text-[0.80rem] btn md:text-[1rem] bg-[#C5221F] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"
                    />
                    <Button
                      value="View Cart"
                      onClick={handleCartNavigate}
                      cls_name="text-[0.80rem] btn md:text-[1rem] bg-[#0000FF] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button className="" onClick={() => toggleMe()}>
                      <div className="flex gap-2 items-center text-[#333] text-[1rem] text-style font-normal leading-normal">
                        Go Back <AiOutlineArrowRight />
                      </div>
                    </button>
                  </div>
                </div>
              ) : isPasswordChangeOpen ? (
                <div>
                  {sessionTimeOut && (
                    <div>
                      <div
                        className="flex items-center  p-3 mb-4 text-[0.8rem] text-red-800 rounded-[0.25rem] bg-red-50"
                        role="alert"
                      >
                        <svg
                          className="flex-shrink-0 inline w-4 h-4 mr-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                          <span className="text-red-400">{sessionTimeOut}</span>
                        </div>
                      </div>
                      {/* <span>{sessionTimeOut}</span> */}
                      <div className="flex justify-end">
                        <button className="" onClick={() => signingOut()}>
                          <div className="flex gap-4 items-center text-[#333] text-[1rem] text-style font-normal leading-normal">
                            <PiSignOutBold />
                            Sign out
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="">
                    <Input
                      label="New Password:"
                      id="new_password"
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      label_cls_name="leading-normal poppins capitalize text-[0.66725rem] font-normal"
                      type="password"
                      cls_name="w-full bg-[#EEE] rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#4b4be6] focus:ring-[2px] focus:ring-[#9a9ae6] text-base outline-none text-[#696969] py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <Input
                      label="Comfirm Password:"
                      id="c_password"
                      name="c_password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      label_cls_name="leading-normal poppins capitalize text-[0.66725rem] font-normal"
                      type="password"
                      cls_name="w-full bg-[#EEE] rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#4b4be6] focus:ring-[2px] focus:ring-[#9a9ae6] text-base outline-none text-[#696969] py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <div className="flex justify-center">
                      <Button
                        value="submit"
                        disabled={!isMatching}
                        cls_name={` ${
                          !isMatching && "bg-[#a0a0fa]"
                        } "text-[0.80rem] btn md:text-[1rem] bg-[#0000FF] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]`}
                      />
                    </div>
                  </form>
                  <div className="flex justify-end">
                    <button
                      className=""
                      onClick={() => setIsManageAccountOpen(true)}
                    >
                      <div className="flex gap-2 items-center text-[#333] text-[1rem] text-style font-normal leading-normal">
                        Go Back <AiOutlineArrowRight />
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="mx-auto"
                  onClick={() => setIsManageAccountOpen(true)}
                >
                  <div className="flex mt-4 gap-4 items-center text-[#333] text-[1rem] text-style font-normal leading-normal">
                    <AiFillSetting />
                    Manage Account
                  </div>
                </button>
              )}
            </div>
            {!isManageAccountOpen && !isPasswordChangeOpen ? (
              <div className="">
                <button className="mx-auto" onClick={() => signingOut()}>
                  <div className="flex gap-4 items-center text-[#333] text-[1rem] text-style font-normal leading-normal">
                    <PiSignOutBold />
                    Sign out
                  </div>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
};
