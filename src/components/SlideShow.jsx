import React from "react";
import { useEffect } from "react";
import { Button } from "./Button";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
// Import Swiper React components
import { SwiperSlide } from "swiper/react";
// import hero1 from "../assets/hero1.png";


export const SlideShow = ({ menuRef, isSidebarOpen, paragrhap, img, heading }) => {
  
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        if (isSidebarOpen) {
          console.log('done');
        }
        console.log("hi")
        // Close the navbar or perform your action here
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuRef, isSidebarOpen]);
  return (
      <SwiperSlide className=" flex flex-col justify-center items-center md:flex-row">
        <div className="w-full md:w-[50%]">
          <div className="md:[80%]">
            <h1 className=" w-[24.1875rem] mx-auto h-[10.6875rem] flex-shrink-0 text-[2.3rem] overflow-x-hidden roboto leading-[3rem] mt-10 font-bold text-center md:text-start md:w-[76%] sm:w-[90%] md:ml-20 balance">
             {heading}
            </h1>
            <p className="text-[#000] poppins leading-normal text-center text-style font-normal text-[0.875rem] mx-auto w-[16.8125rem] md:w-[75.5%] sm:w-[80%] md:text-justify balance">
                {paragrhap}
            </p>

            <div className="flex mx-auto w-[20rem] md:w-[72.5%] md:justify-start md:gap-5 justify-evenly mt-[3rem] mb-[2rem] items-center">
              <Button
                value="Join us today!"
                cls_name=" flex justify-center items-center bg-[#0F9D58] text-[#FFFFFF] poppins text-style font-bold leading-normal rounded-[0.32494rem] py-[0.6905rem] px-[1.34038rem]"
              />
              <div className="flex items-center gap-1">
                <a
                  href=""
                  className="text-[#4285F4] poppins text-style font-normal underline leading-normal capitalize text-[0.7595rem]"
                >
                  learn more
                </a>{" "}
                <LiaLongArrowAltRightSolid className="text-[#4285F4]" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[50%] px-5 md:px-0">
          <img
            src={img}
            className=" w-[22.8125rem] sm:w-[32rem] rounded-[2rem] h-[23.95313rem] mx-auto object-cover mt-10 sm:mt-5 md:w-[30.5rem] md:h-[27.375rem]"
          />
        </div>
      </SwiperSlide>
  );
};
