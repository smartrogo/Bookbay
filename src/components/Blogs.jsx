import React from "react";
import { Text } from "./Text";
import { BlogCart } from "./BlogCart";

export const Blogs = () => {
  return (
    <section className=" border-2 text-style border-red-500 mt-6 text-center">
      <Text
        head="from our blogs"
        body="Lorem ipsum dolor sit amet consectetur. Diam ut feugiat aliquet in varius feugiat magna dictum. Tortor diam et placerat."
      />

    <BlogCart />
    </section>
  );
};
