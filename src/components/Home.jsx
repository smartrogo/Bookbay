import React from "react";
import { Hero } from "./Hero";
import { MiniSwipper } from "./MiniSwipper";
import { Reasons } from "./Reasons";
import { Testimony } from "./Testimony";
import { Blogs } from "./Blogs";
import { Text } from "./Text";
import { Contact } from "./Contact";
import { Newslatter } from "./Newslatter";
import { Footer } from "./Footer";
// import { Header } from "./Header";

export const Home = () => {

  return (
    <div className="body relative min-h-[100vh] w-full overflow-x-hidden">
      {/* <Header /> */}
      <Hero
        className="border-2 border-red-500" />
      <Text
        head="books categories"
        body=" Lorem ipsum dolor sit amet consectetur. Diam ut feugiat aliquet in
        varius feugiat magna dictum. Tortor diam et placerat."
      />
      <MiniSwipper />
      <Reasons />
      <Testimony />
      <Blogs />
      <Contact />
      <Newslatter />
      <Footer />
    </div>
  );
};
