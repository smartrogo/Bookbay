import React from 'react'

export const Card = (props) => {
  return (
    <div className="block mt-10 w-[18.61144rem] h-[18.755rem] md:w-[25.0625rem] md:h-[25.625rem] lg:w-[26rem] lg:h-[20rem] rounded-[1rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:border-success-300 card">

    <div className="px-6 py-3 text-neutral-600 dark:border-success-300 dark:text-neutral-50 relative">
      <img src={props.img} alt="testimony img" className='absolute -top-7 left-[6.5rem] md:left-[7rem] lg:left-[9.7rem] w-[5.25rem] h-[5.25rem] rounded-[8.25rem]' />
    </div>

    <div className="p-6 mt-4 m">

      <p className="text-sm poppins w-[15.03069rem] md:w-[19.25rem] lg:w-[21.25rem] relative md:mt- text-[0.91488rem] md:text-[1rem] italic font-normal leading-normal poppins text-center mx-auto ">
          <span className="qoute font-bold text-[2.19569rem] absolute left-0 -top-1 md:top-1">
            &#8220;
           </span>
           <br />
          {props.qoute}
           <br />
           <span className="absolute -right-2 top-[7rem] md:top-[10rem] qoute font-bold text-[2.19569rem]">
             &#8220;
           </span>
         </p>
    </div>
    <div className="px-6 py-3  text-style w-full capitalize text-end mr-8 leading-normal roboto">
    <a
          href="#"
             className="text-[1.09788rem]  font-bold"
            tabIndex="0"
            role="link"
           >
            {props.name}
           </a>
           <br />
           <span className=" font-normal">~Student</span>
    </div>
  </div>
  )
}
