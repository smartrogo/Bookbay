import React from "react";
import { Card } from "./Card";

export const Testimony = () => {
  return (
    <section>
      <div className="roboto text-style text-center leading-normal mt-10 mb-24">
        <h1 className="text-[#000] font-bold text-[1.5rem] md:text-[3rem] roboto ">
          Don’t just take our words !
        </h1>

        <p className="capitalize px-12 text-[#666] poppins text-[0.5rem] font-normal md:text-[1rem] md:px-[24] md:w-[48.3125rem] mx-auto">
          Lorem ipsum dolor sit amet consectetur. Diam ut feugiat aliquet in
          varius feugiat magna dictum. Tortor diam et placerat.
        </p>
      </div>

      <div className="flex justify-center">
        <div className=" md:flex md:w-full justify-evenly mx-auto overflow-x-hidden">
          <Card
            profession="Teacher"
            name="Sani muhammad"
            says="Lorem ipsum dolor sit amet consectetur. Sodales risus sed condimentum aliquet eget lectus."
          />
          <Card
            profession="UI/UX Designer "
            name="Muhammad Niimatullahi"
            says="Lorem ipsum dolor sit amet consectetur. Sodales risus sed condimentum aliquet eget lectus."
          />
          <Card
            profession="frontend Engineer "
            name="Muhammad Ala"
            says="Lorem ipsum dolor sit amet consectetur. Sodales risus sed condimentum aliquet eget lectus."
          />
        </div>
      </div>
    </section>
  );
};
