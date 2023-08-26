import React from "react";
import { Card } from "./Card";
import tech2 from "../assets/tech2.jpeg"
import ellipse1 from "../assets/ellipse1.png"
import ellipse3 from "../assets/ellipse3.png"


export const Testimony = () => {
  return (
    <section>
      <div className="roboto text-style text-center leading-normal mt-10 mb-2 md:mb-[2rem]">
        <h1 className="text-[#000] font-bold text-[1.5rem] md:text-[3rem] roboto ">
          Don’t just take our words !
        </h1>

        <p className="capitalize px-12 text-[#666] poppins text-[0.5rem] font-normal md:text-[1rem] md:px-[24] md:w-[48.3125rem] mx-auto">
          Lorem ipsum dolor sit amet consectetur. Diam ut feugiat aliquet in
          varius feugiat magna dictum. Tortor diam et placerat.
        </p>
      </div>

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
    </section>
  );
};
