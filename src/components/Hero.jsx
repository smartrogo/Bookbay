import React from "react";
import { Button } from "./Button";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import hero1 from "../assets/hero1.png";
// Import Swiper styles
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export const Hero = () => {
  return (
    <Swiper
      modules={[Navigation, Autoplay, Pagination, Scrollbar, A11y]}
      spaceBetween={50}
      slidesPerView={1}
      // autoplay={{
      //   delay: 2500,
      //   disableOnInteraction: false,
      // }}
      navigation
      pagination={{
        clickable: true,
      }}
      centeredSlides={true}
      scrollbar={{ draggable: true }}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      className="mt-[21%] md:mt-[7%]"
    >
      <SwiperSlide className="border-2 border-green-500 flex flex-col justify-center items-center md:flex-row">
        <div className="w-full md:w-[50%] border-2 border-red-500">
          <h1 className=" border-2 border-red-500 w-[24.1875rem] h-[10.6875rem] flex-shrink-0 text-[2.5rem] roboto leading-[3rem] mt-10 font-bold text-center balance">
            The online <span className="text-[#FD6727]">book hub</span> that
            you’ve been looking for
          </h1>

          <p className="text-[#000] poppins leading-normal text-center text-style font-normal text-[0.875rem] mx-auto w-[16.8125rem]">
            BookBay is the platform that makes buying, selling, and borrowing
            books easy and fun. You can browse through a huge selection of
            books, find amazing deals, and order them with just a few clicks.
            Create your account today and join the BookBay family.
          </p>

          <div className="flex mx-auto w-[20rem] justify-evenly mt-[3rem] mb-[2rem] items-center">
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
        <div className="w-full md:w-[50%] border-green-500">
          <img
            src={hero1}
            className=" w-[22.8125rem] h-[23.95313rem] mx-auto md:w-[25rem] md:h-[27rem]"
          />
        </div>
      </SwiperSlide>
      <SwiperSlide>Slide 2</SwiperSlide>
      <SwiperSlide>Slide 3</SwiperSlide>
      <SwiperSlide>Slide 4</SwiperSlide>
    </Swiper>
  );
};
