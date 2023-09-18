import React from "react";
import { Hero } from "./Hero";
import { MiniSwipper } from "./MiniSwipper";
import { Reasons } from "./Reasons";
import { Blogs } from "./Blogs";
import { Text } from "./Text";
import { Contact } from "./Contact";
import { Newslatter } from "./Newslatter";
import { Footer } from "./Footer";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Testimony } from "./Testimony";

export const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  console.log(user)

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="body relative min-h-[100vh] w-full overflow-x-hidden">
      <Hero
        className="border-2 border-red-500" />
      <Text
        head="Books Categories"
        body="Discover Diverse Genres: Your Journey Through a World of Book Categories"
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
