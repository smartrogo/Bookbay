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
            <div className=" border-2 border-green-500 flex flex-col gap-10 sm:gap-0 sm:flex-row sm:justify-evenly w-full items-start md:w-[90%] mb-6 md:mb-0">
              <div className=" border-2 mx-auto border-green-500 flex md:block justify-center items-center">
                <div className="">
                  <ul className="text-gray-500 dark:text-gray-400 mx-auto font-medium text-center sm:text-start">
                    <li className="">
                      <Link
                        to="/"
                        className="flex items-center hover:underline"
                      >
                        <span className="self-center font-semibold whitespace-nowrap dark:text-white text-sm text-gray-900 uppercase">
                          Bookbay
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="hover:underline">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="hover:underline">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="hover:underline">
                        Borrow
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="hover:underline">
                        Buy/Sell
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="hover:underline">
                        Wallet Connect
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-2 border-green-500 mx-auto flex md:block justify-center items-center text-center sm:text-start">
                <div className="">
                  <h2 className=" text-sm font-semibold text-gray-900 uppercase dark:text-white">
                    Address
                  </h2>
                  <ul className="para poppins text-[1.125rem] text-style font-normal capitalize leading-normal">
                    <li>
                      <Link
                        to="/"
                        className="hover:underline flex items-center gap-2"
                      >
                        <BiPhoneCall className="w-[1.12506rem] h-[1.12506rem]" />
                        +2348120304001
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/"
                        className="hover:underline flex items-start gap-2"
                      >
                        <BiMap className="w-[1.12506rem] h-[1.12506rem]" />
                       <p className="">
                       No.14 Behind JIBWIS Juma'at Masjid Mariri-Wudil Rd, <br/> opp.
                        Audu Manager Filling Station Kumbotso, 700104, <br/> Kano
                        State - Nigeria
                       </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/"
                        className="hover:underline flex items-center gap-2"
                      >
                        <BiTime className="w-[1.12506rem] h-[1.12506rem]" />
                        Office Time
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-2 border-green-500 mx-auto flex md:block justify-center items-center text-center sm:text-start">
                <div className="">
                  <ul className="text-gray-500 dark:text-gray-400 font-medium underline">
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

              {/* <div className=" border-2 border-red-500 flex md:block justify-center items-center">
             <div>
             <h2 className="mb-2 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Quick links
                </h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                
                  <li>
                    <Link to="/" className="hover:underline flex items-center">
                      Terms Of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="hover:underline flex items-center"> 
                      privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/" className="hover:underline flex items-center">
                      FAQs
                    </Link>
                  </li>
                </ul>
             </div>
              </div> */}
            </div>
          </div>

          <div className="flex mt-4 justify-center">
            <div className="socials flex ">
              <IoLogoInstagram className="mr-2 md:w-[1.5rem] md:h-[1.5rem]" />
              <TiSocialLinkedinCircular className="mr-2 md:w-[1.5rem] md:h-[1.5rem]" />
              <TiSocialTwitterCircular className="mr-2 md:w-[1.5rem] md:h-[1.5rem]" />
              <LiaFacebook className="mr-2 md:w-[1.5rem] md:h-[1.5rem]" />
              <MdOutlineMailOutline className="mr-2 md:w-[1.5rem] md:h-[1.5rem]" />
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-4" />

          <div className="w-[75%] flex justify-center mx-auto text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
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
