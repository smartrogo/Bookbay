import React from "react";
import { Button } from "./Button";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import herosec from "../assets/herosec.png";
import { Link, useNavigate } from "react-router-dom";

function HeroContent() {
  const navigate = useNavigate()
  return (
    <div className="flex h-[115vh] sm:h-[95vh] md:h-[100vh] lg:h-[85vh] flex-col md:gap- items-center md:flex-col lg:flex-row border-2 border-red-500 md:w-[90%] xl:w-[85%] mx-auto">
      <div className="w-full md:w-full border-2 lg:w-[50%]">
        <div className="lg:[70%] border-">

          <h1 className="border-2 w-[21.1875rem] text-center mx-auto md:mx-0 h-[7rem] flex-shrink-0 text-[2.5rem] outfit leading-[3rem] mt-20 md:mt-10 font-bold md:text-center lg:text-start md:w-full md:h-[10.0625rem] lg:w-[34.9375rem] lg:h-[10.0625rem] sm:w-[90%] md:text-[4rem] md:font-bold md:leading-[4.8rem] balance mb-0">
            Your Ultimate
            <br /> Online books-hub
          </h1>

          <p className="poppins border-2 leading-normal text-style font-normal text-[0.875rem] text-center w-[20.3125rem] md:text-center md:w-[70%] md:mx-auto lg:mx-0 lg:w-[33.75rem] md:leading-normal sm:w-[50%] lg:text-start mx-auto md:text-[1.25rem]">
          BookBay: Your one-stop platform for buying, selling, and borrowing books. Discover a vast selection, enjoy great deals, and join our family by signing up today.
          </p>

          <div className="flex border-2 w-[20rem] md:w-[89%] mx-auto md:mx-auto lg:mx-0 md:justify-center lg:justify-start md:gap-5 justify-evenly mt-[2rem] mb-[1rem] items-center">
            <Button
            onClick={() => navigate("/sign-in")}
              value="Join us today!"
              cls_name=" flex justify-center btn items-center border-[2px] border-solid border-[#00F] text-[0.73113rem] md:text-[1.25rem] bg-transparent text-[#0000FF] poppins text-style font-bold leading-normal rounded-[0.32494rem] py-[0.6905rem] px-[1.34038rem] md:rounded-[0.5rem] md:py-[1.0625rem] md:px-[2.0625rem]"
            />
            <div className="flex items-center links gap-[0.56963rem]">
              <Link
                to="/about-us"
                className="text-[#0F0] poppins text-style font-normal underline leading-normal capitalize text-[0.7595rem] md:text-[1.25rem]"
              >
                learn more
              </Link>{" "}
              <LiaLongArrowAltRightSolid className="text-[#0F0] "/>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-2 md:w-[90%] lg:w-[50%] md:px-0 xl:mt-4 flex items-center justify-start lg:justify-end">
        <img
          src={herosec}
          className="w-[23.875rem] sm:w-[32rem] h-[20.3125rem] mx-auto lg:mx-0 object-cover mt-[1rem] mb- sm:mt-5 md:w-full xl:w-[45.84006rem] md:h-fit"
        />
      </div>
    </div>
  )
}

export const Hero = () => {
  return (
    <div className="mt-[14%] sm:mt-[13%] md:mt-[9.5%] lg:mt-[8%] xl:mt-[6%]">
        <HeroContent />
    </div>
  );
};
