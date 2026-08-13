import React from "react";
import { Link } from "react-router-dom";
import { LiaFacebook } from "react-icons/lia";
import { TiSocialTwitterCircular } from "react-icons/ti";
import { TiSocialLinkedinCircular } from "react-icons/ti";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiTelegramLine } from "react-icons/ri";
import { BiTime } from "react-icons/bi";
import { BiMap } from "react-icons/bi";
import { BiPhoneCall } from "react-icons/bi";
import {BsWhatsapp} from "react-icons/bs"

const getCurrentYear = () => {
  return new Date().getFullYear();
};

export const Footer = () => {
  return (
    <div className="mt-24  bottom-0 w-full">
      <footer className=" bg-[#1E1E1E]">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="flex md:justify-center md:w-[] mx-auto">
            <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:justify-evenly w-full items-start md:w-[90%] mb-6 md:mb-0">
              <div className="mx-auto flex md:block justify-center items-center">
                <div className="text-center md:text-start">
                  <Link to="/">
                    <h2 className="outfit text-[1.125rem] capitalize text-style leading-normal font-bold pb-2 text-[#FFF]">
                      Bookbay
                    </h2>
                  </Link>
                  <ul className="text-[#d2cfcf] text-[0.875rem] md:text-[1.125rem] mx-auto font-normal text-style leading-normal capitalize poppins text-center sm:text-start">
                    <li className="pb-2">
                      <Link to="/" className="hover:underline ">
                        Home
                      </Link>
                    </li>
                    <li className="pb-2">
                      <Link to="/about-us" className="hover:underline">
                        About Us
                      </Link>
                    </li>
                    <li className="pb-2">
                      <Link to="/borrow" className="hover:underline">
                        Borrow
                      </Link>
                    </li>
                    <li className="pb-2">
                      <Link to="/buy" className="hover:underline">
                        Buy/Sell
                      </Link>
                    </li>
                    <li className="">
                      <Link to="/connect-wallet" className="hover:underline">
                        Wallet Connect
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mx-auto flex md:block justify-center items-center text-center sm:text-start md:text-start">
                <div className="text-center sm:text-start">
                  <h2 className=" outfit text-[1.125rem] capitalize text-style leading-normal font-bold pb-2 text-[#FFF]">
                    Address
                  </h2>
                  <ul className="text-[#d2cfcf] text-[0.875rem] md:text-[1.125rem] mx-auto font-normal text-style leading-normal capitalize poppins text-center sm:text-start">
                    <li>
                      <Link
                        to="/"
                        className=" flex items-center gap-2 py-2 justify-center sm:justify-start hover:underline"
                      >
                        <BiPhoneCall className="w-[1.12506rem] h-[1.12506rem]" />
                        +2348120304001
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/"
                        className="flex items-start justify-center balance hover:underline"
                      >
                        <BiMap className="w-[1.12506rem] hidden sm:block h-[1.12506rem]" />
                        <p className=" text-center sm:text-start">
                          No.14 Opp. Audu Manager Filling Station Kumbotso,{" "}
                          <br />
                          700104, Kano State – Nigeria
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/"
                        className="flex items-center gap-2 justify-center sm:justify-start py-2 hover:underline"
                      >
                        <BiTime className="w-[1.12506rem] h-[1.12506rem]" />
                        Monday-Friday 9:00 AM -5:00 PM
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mx-auto flex md:block justify-center items-center text-center sm:text-start">
                <div className="">
                  <ul className="text-[#d2cfcf] text-[0.875rem] md:text-[1.125rem] mx-auto font-normal text-style leading-normal capitalize poppins text-center sm:text-start ">
                    <li>
                      <Link to="/terms-of-service" className="hover:underline">
                        Term of Service
                      </Link>
                    </li>
                    <li>
                      <Link to="/privacy-policy" className="hover:underline">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/frequent-questions"
                        className="hover:underline"
                      >
                        FAQs
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex mt-4 social justify-center">
            <div className="flex ">
              <Link to="https://wa.me/2348120304001" className="mt-1">
                <BsWhatsapp className="mr-2 cursor-pointer w-[1.3rem] h-[1.3rem] md:w-[1.5rem] md:h-[1.5rem]" />
              </Link>

              <Link to="https://web.facebook.com/bookbay.application/">
                <LiaFacebook className="mr-2 w-[1.5rem] h-[1.5rem] cursor-pointer md:w-[2rem] md:h-[2rem]" />
              </Link>

              <Link to="https://www.linkedin.com/company/bookbay/">
                <TiSocialLinkedinCircular className="mr-2 cursor-pointer w-[1.5rem] h-[1.5rem] md:w-[2rem] md:h-[2rem]" />
              </Link>

              <Link to="https://twitter.com/Bookbay_App">
                <TiSocialTwitterCircular className="mr-2 w-[1.5rem] cursor-pointer h-[1.5rem] md:w-[2rem] md:h-[2rem]" />
              </Link>

              <Link to="Info@bookbay.com.ng ">
                <MdOutlineMailOutline className="mr-2 w-[1.5rem] cursor-pointer h-[1.5rem] md:w-[2rem] md:h-[2rem]" />
              </Link>

              <Link to="https://t.me/bookbay_App">
                <RiTelegramLine className="mr-2 w-[1.5rem] cursor-pointer h-[1.5rem] md:w-[2rem] md:h-[2rem]" />
              </Link>
            </div>
          </div>
          <hr className="my-6 h-[1px]  mx-auto w-[90%] border-[#FFFFFF] lg:my-4" />

          <div className="w-[75%] roboto flex justify-center text-[0.5rem] md:text-[1rem] font-normal text-style leading-normal mx-auto text-center">
            <span className="text-sm text-[#d2cfcf]">
              Copyright © {getCurrentYear()} . All Rights Reserved <br /> By
              <Link to="/" className="underline pl-1">
                Bookbay
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};