import React from "react";
import { Hero } from "./Hero";
import { MiniSwipper } from "./MiniSwipper";
import { Reasons } from "./Reasons";
// import { Testimony } from "./Testimony";
import { Blogs } from "./Blogs";
import { Text } from "./Text";
import { Contact } from "./Contact";
import { Newslatter } from "./Newslatter";
import { Footer } from "./Footer";
// import { Header } from "./Header";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PlayGround } from "./playGround";

export const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  console.log(user)

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

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
      <PlayGround />
      <Blogs />
      <Contact />
      <Newslatter />
      <Footer />
    </div>
  );
};
