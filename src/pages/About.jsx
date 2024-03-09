import React from "react";
import sule from "../assets/sule.png";
import niima from "../assets/niima.png";
import baraka from "../assets/baraka.png";
import { Footer } from "../components/Footer";
import amin from "../assets/amin.png";
import ala from "../assets/ala.png";
import abdullahi from "../assets/abdullahi.png";
import zainab from "../assets/zainab.png";
import hauwa from "../assets/hauwa.png";

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
        <img
          className="mb-6 md:w-[17.9375rem] object-scale-down  h-[17.9375rem]"
          src={img}
          alt={alt}
        />
        <p className="font-bold text-[1rem] md:text-[1.5rem]">{name}</p>

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

      <div className="founders p-4 w-[100%] md:w-[85%] mx-auto">
        <h2 className="text-[#00f] mb-10 outfit text-[1.5rem] capitalize font-bold leading-normal">
          meet our amazing and <br /> hardworking bookbay team{" "}
        </h2>

        <div className="flex flex-col md:flex-row justify-between">
          <Person img={sule} name="M.A Sulaiman" position="CEO: Bookbay" />

          <Person
            img={niima}
            name="Muhammad Ni’imatullahi"
            position="Full stack designer"
          />

          <Person img={ala} name="Muhammad ala" position="Frontend engineer" />
          <Person
            img={abdullahi}
            name="Abdullahi Shehu"
            position="CTO Bookbay"
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <Person
            img={amin}
            name="Amin bin Ibrahim"
            position="advisory board "
          />

          <Person
            img={zainab}
            name="zainab venessa gajere"
            position="customer support"
          />

          <Person
            img={baraka}
            name="Baraka Muhammad"
            position="Business Develop"
          />
          <Person
            img={hauwa}
            name="Hauwa musa abdullahi"
            position="CMO Bookbay"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};
