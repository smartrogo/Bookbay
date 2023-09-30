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
        body="Explore a world of knowledge and insights from our blogs. Discover fresh perspectives, tips, and inspiration for your interests and endeavors."
      />

      <div className="mt-6 md:flex md:gap-[1rem] lg:gap-[3.3125rem] justify-center md:w-[90%] mx-auto">
        <BlogCart img={blog01} value="10 october, 2023" head="Unlocking Reading Adventures: Your Guide to Getting Started with BookBay" body="Unlocking Reading Adventures: Your Guide to Getting Started with Bookbay offers valuable insights and tips for new Bookbay users, enhancing their literary journey."/>
        <BlogCart img={blogImg} value="2 september, 2023" head="Savings Unleashed: How BookBay Redefines Affordable Reading" body="Savings Unleashed: How Bookbay Redefines Affordable Reading explores how Bookbay provides budget-friendly reading options, making books accessible to all."/>
      </div>
    </section>
  );
};
