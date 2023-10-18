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
    <div className="flex items-center justify-center text-center my-2 text-[#000] text-style capitalize leading-normal">
      <div className="mx-auto flex flex-col justify-center items-center">
        <img className="mb-6 w-[17.9375rem] object-scale-down h-[17.9375rem]" src={img} alt={alt} />
        <span className="font-bold text-[1.25rem] md:text-1.5rem]">{name}</span>
        <p className=" font-normal text-[1rem] md:text-1.25rem]">{position}</p>
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
          body="Bookbay is a revolutionary decentralized social networking platform designed to encourage the reading culture in Africa by addressing the challenges associated with textbook borrowing, buying, and selling. Our new peer-to-peer protocol changes access to educational resources for students, researchers, and individuals alike.
          With Bookbay, we aspire to foster a stronger reading culture in Africa, making educational resources more accessible and affordable for everyone, thus contributing to the intellectual growth and development of our continent."
        />
        <div className="md:flex md:mt-10 md:gap-4">
          <Discription
            title="Our Mission"
            body="Bookbay aims to revolutionize African education by providing affordable access to textbooks and fostering a community of lifelong learners. We strive to break down financial barriers and promote knowledge-sharing, making quality education accessible to all."
          />
          <Discription
            title="Our Vision"
            body="We envision a future in Africa where every individual embraces a culture of reading, learning, and intellectual growth, empowered by Bookbay's platform to access affordable educational resources and connect with a global community of knowledge seekers."
          />
        </div>
      </div>

      <div className="founders p-4 w-[100%] md:w-[90%] mx-auto">
        <h2 className="text-[#00f] mb-10 outfit text-[1.5rem] capitalize font-bold leading-normal">
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
