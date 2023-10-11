import React from "react";
import ceo from "../assets/ceo.png";
import designer from "../assets/designer.png";
import engineer from "../assets/engineer.png";
import { Footer } from "../components/Footer";

const Discription = ({ title, body }) => {

  return (
    <div className="text-style text-start my-4 capitalize">
      <h2 className="text-[#00f] outfit text-[1.5rem] font-bold leading-normal ">
        {title}
      </h2>

      <p className="text-[#000] poppins text-[1rem] font-normal">{body}</p>
    </div>
  );
};

const Person = ({ img, name, position, alt }) => {
  return (
    <div className="flex items-center justify-center text-center my-2 text-[#000] poppins text-style capitalize leading-normal text-[1.5rem]">
      <div className="mx-auto flex flex-col justify-center items-center">
        <img className=" mb-6" src={img} alt={alt} />
        <span className="font-bold">{name}</span>
        <p className=" font-normal">{position}</p>
      </div>
    </div>
  );
};

export const About = () => {
  return (
    <div className="mt-20 h-screen">
      <div className="p-4 w-[100%] md:w-[85%] mx-auto">
        <Discription
          title="About bookbay"
          body="Bookbay is a decentralized social networking textbook borrowing platform that solves the problem of textbook borrowing using a peer-to-peer protocol.  At Bookbay, we understand how expensive college can be, that’s why we give student, researchers and other individuals, the option to buy, sell, borrow at cheaper rate from a verify seller."
        />
        <div className="md:flex md:mt-10 md:gap-4">
          <Discription
            title="Our Mission"
            body="Our mission is to Enhence Reading Culture in Africa and provide a seamless platform that empowers readers to discover a diverse range of books, connect with fellow book enthusiasts, and foster a vibrant community of lifelong learners through the joy of reading."
          />
          <Discription
            title="Our Vision"
            body="To become the premier online destination, where readers of all backgrounds and interests can explore, connect, and share their love for literature."
          />
        </div>
      </div>

      <div className="founders p-4 w-[100%] md:w-[90%] mx-auto">
        <h2 className="text-[#00f] mb-10 outfit text-[1.5rem] capitalize font-bold leading-normal md:text-center">
          meet our amazing and <br /> hardworking bookbay team{" "}
        </h2>

        <div className="flex flex-col md:flex-row justify-between">
          <Person img={ceo} name="Engr, M.A Sulaiman" position="CEO: Bookbay" />

          <Person
            img={designer}
            name="Muhammad Ni’imatullahi"
            position="Full stack designer"
          />

          <Person
            img={engineer}
            name="Muhammad ala"
            position="Frontend engineer"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};
