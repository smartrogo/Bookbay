import React from "react";
import { Link } from "react-router-dom";
import { LiaFacebook } from "react-icons/lia";
import { TiSocialTwitterCircular } from "react-icons/ti";
import { TiSocialLinkedinCircular } from "react-icons/ti";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoLogoInstagram } from "react-icons/io5";
import { BiTime } from "react-icons/bi";
import { BiMap } from "react-icons/bi";
import { BiPhoneCall } from "react-icons/bi";

export const Footer = () => {
  return (
    <div className="mt-24">
      <footer className="footer ">
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
                  <ul className="para text-[0.875rem] md:text-[1.125rem] mx-auto font-normal text-style leading-normal capitalize poppins text-center sm:text-start">
                    <li className="pb-2">
                      <Link to="/" className="hover:underline ">
                        Home
                      </Link>
                    </li>
                    <li className="pb-2">
                      <Link to="/" className="hover:underline">
                        About Us
                      </Link>
                    </li>
                    <li className="pb-2">
                      <Link to="/" className="hover:underline">
                        Borrow
                      </Link>
                    </li>
                    <li className="pb-2">
                      <Link to="/" className="hover:underline">
                        Buy/Sell
                      </Link>
                    </li>
                    <li className="">
                      <Link to="/" className="hover:underline">
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
                  <ul className="para text-[0.875rem] md:text-[1.125rem] mx-auto font-normal text-style leading-normal capitalize poppins text-center sm:text-start">
                    <li >
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
                          No.14 Behind JIBWIS Juma'at Masjid Mariri-Wudil Rd,{" "}
                          <br /> opp. Audu Manager Filling Station Kumbotso,
                          700104, <br /> Kano State - Nigeria
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/"
                        className="flex items-center gap-2 justify-center sm:justify-start py-2 hover:underline"
                      >
                        <BiTime className="w-[1.12506rem] h-[1.12506rem]" />
                        Office Time
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mx-auto flex md:block justify-center items-center text-center sm:text-start">
                <div className="">
                  <ul className="para text-[0.875rem] md:text-[1.125rem] mx-auto font-normal text-style leading-normal capitalize poppins text-center sm:text-start ">
                    <li>
                      <Link to="/" className="hover:underline">
                        Term of Service
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="hover:underline">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="hover:underline">
                        PAQs
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

            
            </div>
          </div>

          <div className="flex mt-4 social justify-center">
            <div className="flex ">
              <IoLogoInstagram className="mr-2 md:w-[1.5rem] md:h-[1.5rem]" />
              <TiSocialLinkedinCircular className="mr-2 md:w-[1.5rem] md:h-[1.5rem]" />
              <TiSocialTwitterCircular className="mr-2 md:w-[1.5rem] md:h-[1.5rem]" />
              <LiaFacebook className="mr-2 md:w-[1.5rem] md:h-[1.5rem]" />
              <MdOutlineMailOutline className="mr-2 md:w-[1.5rem] md:h-[1.5rem]" />
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-4" />

          <div className="w-[75%] roboto flex justify-center text-[0.5rem] md:text-[1rem] font-normal text-style leading-normal mx-auto text-center">
            <span className="text-sm para">
              Copyright © 2023 . All Rights Reserved <br /> By
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
