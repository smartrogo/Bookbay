import React from "react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Card } from "./Card";

export const PlayGround = () => {




  return (
    <section className="md:w-[70%] border-2 relative overflow-hidden mx-auto min-h-[200px] py-5 px-7 ">
      <h2
        className="my-4 capitalize text-[#000000] font-bold px-1 md:pt-8 pb-4 unbounded"
      >
        what students are saying about this site
      </h2>
      <Swiper
        className="container mx-auto border-2"
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        // slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log('slide change')}
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
          },
          // >= 1024px
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
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