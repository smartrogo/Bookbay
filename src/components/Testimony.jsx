import React from "react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Card } from "./Card";
import { Text } from "./Text";
import techbro from "../assets/techbro.png";
import techman from "../assets/techman.png";
import techgirl from "../assets/techgirl.png";
import hero from "../assets/hero.png";
import { Link } from "react-router-dom";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
export const Testimony = () => {
  return (
    <section className="w-full mt-6 md:w-[95%] relative overflow-hidden mx-auto min-h-[200px] py-5 md:px-7 ">
      <Text
        head="Don’t Just Take Our Words !"
        body=" Lorem ipsum dolor sit amet consectetur. Diam ut feugiat aliquet in
          varius feugiat magna dictum. Tortor diam et placerat."
      />
      <Swiper
        className="container mx-auto "
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        autoplay={{
          delay: 30000,
          disableOnInteraction: false,
        }}
        // slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        breakpoints={{
          // >=200
          200: {
            slidesPerView: 1.2,
            // spaceBetween: 50,
          },
          // >= 400px
          400: {
            slidesPerView: 1.2,
            // spaceBetween: 50,
          },
          // >= 640px
          640: {
            slidesPerView: 2,
            // spaceBetween: 5,
          },
          // >= 1024px
          1024: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          1030: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          // >= 1583px
          1583: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
        }}
      >
        <SwiperSlide className="flex items-center justify-center">
          <Card
            img={techbro}
            qoute="Bookbay is a great bookstore platform for educators: offers diverse resources, discounts, and convenience for enriching classroom learning experiences."
            name="Muhammad Niimatullahi"
          />
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center">
          <Card
            img={techman}
            qoute="Wow! Bookbay is a Lifesaver for students! Easy borrowing, vast collection, saved me money, and made studying more enjoyable."
            name="Muhammad Ala"
          />
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center">
          <Card
            img={hero}
            qoute="Bookbay simplifies student life. Convenient purchases with my card, affordable books, and stress-free online shopping."
            name="smartrogo"
          />
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center">
          <Card
            img={techgirl}
            qoute="Bookbay simplifies student life. Convenient purchases with my card, affordable books, and stress-free online shopping."
            name="smartrogo"
          />
        </SwiperSlide>
      </Swiper>

      <Link className="my-[4rem] roboto font-normal leading-normal text-[0.875rem] md:text-[1.5rem] capitalize text-style text-[#0F0] flex links gap-[0.5rem] md:w-[9rem] absolute right-2 w-[6rem] md:right-4 items-center">
        <span className="underline">see more </span>
        <LiaLongArrowAltRightSolid className="w-[1.5rem] mt-1" />
      </Link>
      <hr className=" h-[1px] mt-[9rem] mx-auto w-[100%] border-[#333]" />
    </section>
  );
};
