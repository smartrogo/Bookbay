import React from "react";
import { Button } from "./Button";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import herosec from "../assets/herosec.png";
import { Link, useNavigate } from "react-router-dom";

function HeroContent() {
  const navigate = useNavigate()
  return (
    <div className="flex h-[100vh] md:h-[75vh] lg:h-[85vh] flex-col md:gap- items-center md:flex-row md:w-[90%] xl:w-[85%] mx-auto">
      <div className="w-full md:w-[50%]">
        <div className="lg:[70%] xl:pl-1">
          <h1 className=" w-[21.1875rem] text-center mx-auto md:mx-0 h-[7rem] flex-shrink-0 text-[2.5rem] outfit leading-[3rem] mt-20 md:mt-10 font-bold md:text-start md:w[31.9375rem] sm:w-[90%]  balance mb-0">
            Your Ultimate
            <br /> Online
            <span className="text-[#DAA520] capitalize balance underscore">
              {" "}
              books-hub
            </span>
          </h1>
          <p className="poppins leading-normal text-style font-normal text-[0.875rem] text-center w-[20.3125rem] md:w-[90%] lg:w-[84%] xl:w-[80%] sm:w-[50%] md:text-start mx-auto md:mx-0">
          BookBay: Your one-stop platform for buying, selling, and borrowing books. Discover a vast selection, enjoy great deals, and join our family by signing up today.
          </p>

          <div className="flex w-[20rem] md:w-[89%] mx-auto md:mx-0 md:justify-start md:gap-5 justify-evenly mt-[2rem] mb-[1rem] items-center">
            <Button
            onClick={() => navigate("/sign-in")}
              value="Join us today!"
              cls_name=" flex justify-center btn items-center bg-[#0F9D58] text-[#FFFFFF] poppins text-style font-bold leading-normal rounded-[0.32494rem] py-[0.6905rem] px-[1.34038rem]"
            />
            <div className="flex items-center links gap-1">
              <Link
                href=""
                className="text-[#4285F4] poppins text-style font-normal underline leading-normal capitalize text-[0.7595rem]"
              >
                learn more
              </Link>{" "}
              <LiaLongArrowAltRightSolid className="text-[#4285F4] "/>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[50%] px-5 md:px-0 xl:mt-4 flex items-center justify-start">
        <img
          src={herosec}
          className="w-[23.875rem] sm:w-[32rem] h-[20.3125rem] mx-auto object-cover mt-[1rem] mb- sm:mt-5 md:w-full xl:w-[45.84006rem] md:h-fit"
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
