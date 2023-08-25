import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";

// Import the CSS files.
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import hero1 from "../assets/hero1.png";
import z from "../assets/z.jpg";
import com from "../assets/com.jpg";

export default function ThumbnailCarousel() {
  // Define the options for the main carousel.
  const mainOptions = {
    type: "fade",
    height: "30rem",
    cover: true,
    sync: "thumbnail-carousel", // Sync with the thumbnail carousel.
  };

  // Define the options for the thumbnail carousel.
  const thumbnailOptions = {
    fixedWidth: 100,
    fixedHeight: 64,
    gap: 10,
    rewind: true,
    pagination: false,
    cover: true,
    isNavigation: true, // Enable navigation by clicking thumbnails.
    focus: "center",
    breakpoints: {
      600: {
        fixedWidth: 66,
        fixedHeight: 40,
      },
    },
    id: "thumbnail-carousel", // Add an ID to the thumbnail carousel.
  };

  // Define an array of image sources.
  const images = [com, z, hero1];

  // Define an array of image alt texts.
  const alts = ["A beautiful landscape", "A cute kitten", "A delicious cake"];

  return (
    <div className="ThumbnailCarousel mt-20">
      {/* Render the thumbnail carousel. */}
      <Splide options={thumbnailOptions}>
        {images.map((image, index) => (
          <SplideSlide key={index}>
            <img src={image} alt="" />
          </SplideSlide>
        ))}
      </Splide>

      {/* Render the main carousel. */}
      <Splide options={mainOptions}>
        {images.map((image, index) => (
          <SplideSlide key={index}>
            <img src={image} alt={alts[index]} />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}
