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
import { Link } from "react-router-dom";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
export const Testimony = () => {
  return (
    <section className="w-full mt-6 md:w-[95%] relative overflow-hidden mx-auto min-h-[200px] py-5 md:px-7 ">
      <Text head="Don’t Just Take Our Words !" body="Readers recormendation!" />
      <Swiper
        className="container mx-auto "
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        autoplay={{
          delay: 30000,
          disableOnInteraction: false,
        }}
        // slidesPerView={3}
        // navigation
        // pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        breakpoints={{
          // >=200
          200: {
            slidesPerView: 1.2,
            spaceBetween: 20,
          },
          // >= 400px
          400: {
            slidesPerView: 1.2,
            spaceBetween: 30,
          },
          // >= 640px
          600: {
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
            spaceBetween: 30,
          },
          // >= 1583px
          1583: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
      >
        <SwiperSlide className="flex items-center justify-center">
          <Card
            img={techbro}
            qoute="Bookbay is a game-changer for students and researchers in Africa. It's the most affordable and convenient way to access textbooks. I highly recommend Bookbay to anyone who wants to save money on textbooks and support the reading culture in Africa."
            name="Dr. AbenaKorkor"
            role="~ Professor of English, University of Ghana"
          />
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center">
          <Card
            img={techman}
            qoute="Bookbay is a lifesaver for students like me. I can finally afford to buy the textbooks I need without breaking the bank. I also love that Bookbay is a community of learners. I've been able to connect with other students and researchers who share my interests."
            role="~ Student, University of Nairobi"
            name="Kwame Osei"
          />
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center">
          <Card
            img={techgirl}
            qoute="Bookbay is a brilliant platform that is making education more accessible and affordable for everyone in Africa. I'm so grateful for the opportunity to be a part of the Bookbay community."
            name="Aisha Mohammed"
            role="~ Researcher, Northwest University, Kano-Nigeria "
          />
        </SwiperSlide>
      </Swiper>

      <Link className="my-[4rem] roboto font-normal leading-normal text-[0.775rem] md:text-[1.5rem] capitalize text-style text-[#31af31] flex links gap-[0.2rem] md:w-[9rem] absolute right-2 w-[6rem] md:right-4 items-center">
        <span className="underline">see more </span>
        <LiaLongArrowAltRightSolid className="w-[1.5rem] mt-1" />
      </Link>
      <hr className=" h-[1px] mt-[9rem] mx-auto w-[100%] border-[#333]" />
    </section>
  );
};
