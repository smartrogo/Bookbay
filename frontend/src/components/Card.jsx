import React from 'react'

export const Card = (props) => {
  return (
    <div className="block mt-10 w-[24.61144rem] h-[24.755rem] md:w-[25.0625rem] md:h-[24.625rem] lg:w-[24rem] lg:h-[25rem] rounded-[1rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:border-success-300 bg-[#eeeeee]">
      <div className="px-6 pt-3 pb-7 relative">
        <img
          src={props.img}
          alt="testimony img"
          className="absolute -top-7 left-[6.5rem] md:left-[7rem] lg:left-[9.7rem] w-[5.25rem] h-[5.25rem] tbd rounded-[8.25rem]"
        />
      </div>

      <div className="p-6 mt-4 pr-[2rem] md:pr-[3rem]">
        <div className="flex justify-center items-center">
          <p className="text-sm poppins w-[16.03069rem] md:w-[17.25rem] lg:w-[17.25rem] relative text-[0.91488rem] md:text-[1rem] italic font-normal leading-[25px] text-center mx-auto text-[#000]">
            {props.qoute}
          </p>
        </div>
        <div className="px-6 text-style w-full capitalize text-end mr-8 text-[#000] leading-normal roboto"></div>
      </div>
      <div className="text-end absolute bottom-0 w-fit mb-4">
        <p className="text-[1.09788rem] text-center font-bold" tabIndex="0">
          {props.name}
        </p>
        <span className=" font-normal">{props.role}</span>
      </div>
    </div>
  );
}
