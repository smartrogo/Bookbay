import React from "react";
import { Text } from "./Text";
import { BlogCart } from "./BlogCart";
import blog01 from "../assets/blog01.png";
import blogImg from "../assets/blogImg.png"

export const Blogs = () => {
  return (
    <section className="text-style mt-6 text-center">
      <Text
        head="From Our Blogs"
        body="Lorem ipsum dolor sit amet consectetur. Diam ut feugiat aliquet in varius feugiat magna dictum. Tortor diam et placerat."
      />

      <div className="mt-6 md:flex md:gap-[3.3125rem] justify-center md:w-[90%] mx-auto">
        <BlogCart img={blog01}/>
        <BlogCart img={blogImg}/>
      </div>
    </section>
  );
};
