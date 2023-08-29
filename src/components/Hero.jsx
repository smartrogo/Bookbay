import React from "react";
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

export const Hero = () => {
  const head = (
    <>
      {" "}
      Your Ultimate Online{" "}
      <span className="text-[#FD6727] balance underscore">books-hub</span>
    </>
  );

  const para =
    "BookBay: Your one-stop platform for buying, selling, and borrowing books. Discover a vast selection, enjoy great deals, and join our family by signing up today.";
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
      allowTouchMove={false}
      centeredSlides={true}
      scrollbar={{ draggable: true }}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      className="mt-[21%] mb-10 sm:mt-[10%] md:mt-[6.5%]"
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
