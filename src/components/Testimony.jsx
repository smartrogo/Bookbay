import React from "react";
import { Card } from "./Card";
import tech2 from "../assets/tech2.jpeg";
import ellipse1 from "../assets/ellipse1.png";
import ellipse3 from "../assets/ellipse3.png";
import { Link } from "react-router-dom";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { Text } from "./Text";

export const Testimony = () => {
  return (
    <section className="">
      <Text
        head="Don’t just take our words !"
        body=" Lorem ipsum dolor sit amet consectetur. Diam ut feugiat aliquet in
          varius feugiat magna dictum. Tortor diam et placerat."
      />
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-6 md:justify-evenly">
          <Card
            profession="Teacher"
            name="Sani muhammad"
            img={ellipse1}
            says="Lorem ipsum dolor sit amet consectetur. Sodales risus sed condimentum aliquet eget lectus."
          />
          <Card
            profession="UI/UX Designer "
            name="Muhammad Niimatullahi"
            img={tech2}
            says="Lorem ipsum dolor sit amet consectetur. Sodales risus sed condimentum aliquet eget lectus."
          />
          <Card
            profession="frontend Engineer "
            name="Muhammad Ala"
            img={ellipse3}
            says="Lorem ipsum dolor sit amet consectetur. Sodales risus sed condimentum aliquet eget lectus."
          />
        </div>
      </div>
      <Link className="my-10 roboto font-normal leading-normal text-[0.875rem] md:text-[1.5rem] capitalize text-style text-[#4285F4] flex justify-end w-[80%] md:w-[86%] mx-auto items-center">
        <span className="underline">see more </span>
        <LiaLongArrowAltRightSolid className="w-[1.5rem] mt-1" />
      </Link>
      <hr className=" h-[1px] mt-10 mx-auto w-[90%] border-[#333] " />
    </section>
  );
};
