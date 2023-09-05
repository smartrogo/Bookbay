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
export const PlayGround = () => {
  return (
    <section className="w-full md:w-[95%] relative overflow-hidden mx-auto min-h-[200px] py-5 md:px-7 ">
      <Text
        head="Don’t just take our words !"
        body=" Lorem ipsum dolor sit amet consectetur. Diam ut feugiat aliquet in
          varius feugiat magna dictum. Tortor diam et placerat."
      />
      <Swiper
        className="container mx-auto "
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        // slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        breakpoints={{
          // >=200
          200: {
            slidesPerView: 1,
            // spaceBetween: 10
          },
          // >= 40px
          400: {
            slidesPerView: 1,
            // spaceBetween: 10
          },
          // >= 640px
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          // >= 1024px
          1024: {
            slidesPerView: 2.5,
            spaceBetween: 20,
          },
          1034: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          // >= 1583px
          1583: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        <SwiperSlide className="flex items-center justify-center">
          <Card />
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center">
          <Card />
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center">
          <Card />
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center">
          <Card />
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center">
          <Card />
        </SwiperSlide>
        <SwiperSlide className="flex items-center justify-center">
          <Card />
        </SwiperSlide>
      </Swiper>
    </section>
  );
};
