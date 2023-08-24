import React from "react";
import { useEffect } from "react";
import { Button } from "./Button";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { SlideShow } from "./SlideShow";
import { Swiper, SwiperSlide } from "swiper/react";
import hero1 from "../assets/hero1.png";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export const Hero = ({ menuRef, isSidebarOpen }) => {
  const head = (
    <h1>
      {" "}
      The online <span className="text-[#FD6727] balance underscore">books-hub</span> <br/> that
      you’ve been looking for
    </h1>
  );

  const para =
    "  BookBay is the platform that makes buying, selling, and borrowing books easy and fun. You can browse through a huge selection of books, find amazing deals, and order them with just a few clicks.Create your account today and join the BookBay family.";
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        if (isSidebarOpen) {
          console.log("done");
        }
        console.log("hi");
        // Close the navbar or perform your action here
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuRef, isSidebarOpen]);
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
      className="mt-[21%] sm:mt-[10%] md:mt-[6.5%]"
    >

      <SwiperSlide>
        <SlideShow paragrhap={para} heading={head} img={hero1} />
      </SwiperSlide>
      <SwiperSlide>
        <SlideShow paragrhap={para} heading={head} img={hero1} />
      </SwiperSlide>
      <SwiperSlide>
        <SlideShow paragrhap={para} heading={head} img={hero1} />
      </SwiperSlide>
    </Swiper>
  );
};
