// import React from "react";

// export const Card = (props) => {
//   return (
//     <div>
//       <div className="w-[18.61144rem] md:w-[20.0625rem] mt-[4rem] px-8 card h-[20rem] rounded-[0.73188rem] md:rounded-[1rem] box relative">
//         <div className="flex justify-center md:justify-end absolute -top-[3rem] left-[34%]">
//           <img
//             className=" object-cover w-[6.03819rem] h-[6.03819rem] testimony rounded-[6.03819rem] border-solid"
//             alt="Testimonial pic"
//             src={props.img}
//           />
//         </div>

//         <div className="mt-20">
//         <p className="text-sm poppins relative border-2 border-red-500 md:mt-8 text-[0.91488rem] md:text-[1.25rem] italic font-normal leading-normal poppins text-center w-[12.03069rem] md:w-[16.4375rem] mx-auto ">
//           <span className="qoute font-bold text-[2.19569rem] absolute left-0 -top-1 md:top-1">
//             &#8220;
//           </span>
//           <br />
//           {props.says}
//           <br />
//           <span className=" absolute right-2 top-[5.5rem] md:top-[10rem] qoute font-bold text-[2.19569rem]">
//             &#8220;
//           </span>
//         </p>
//         </div>
       

//         <div className="mt-14 md:mt-[4rem] text-style w-full capitalize text-end mr-8 leading-normal roboto">
//           <a
//             href="#"
//             className="text-[1.09788rem]  font-bold"
//             tabIndex="0"
//             role="link"
//           >
//             {props.name}
//           </a>
//           <br />
//           <span className=" font-normal">~{props.profession}</span>
//         </div>
//       </div>
//     </div>
//   );
// };



import React from 'react'
import  ellipse3  from "../assets/ellipse3.png"

export const Card = () => {
  return (
    <div className="block mt-10 w-[18.61144rem] h-[18.755rem] md:w-[25.0625rem] md:h-[25.625rem] lg:w-[26rem] lg:h-[20rem] rounded-[1rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:border-success-300 card">

    <div className="px-6 py-3 text-neutral-600 dark:border-success-300 dark:text-neutral-50 relative">
      <img src={ellipse3} alt="testimony img" className='absolute -top-10 left-[6.2rem] md:left-[7rem] lg:left-[9.7rem] w-[5.25rem] h-[5.25rem] rounded-[8.25rem]' />
    </div>

    <div className="p-6 mt-4 m">

      <p className="text-sm poppins w-[15.03069rem] md:w-[19.25rem] lg:w-[21.25rem] relative md:mt- text-[0.91488rem] md:text-[1rem] italic font-normal leading-normal poppins text-center mx-auto ">
          <span className="qoute font-bold text-[2.19569rem] absolute left-0 -top-1 md:top-1">
            &#8220;
           </span>
           <br />
           Bookbay is a great bookstore platform for educators: offers diverse resources, discounts, and convenience for enriching classroom learning experiences.
           <br />
           <span className="absolute -right-2 top-[7rem] md:top-[10rem] qoute font-bold text-[2.19569rem]">
             &#8220;
           </span>
         </p>
    </div>
    <div className="px-6 py-3 text-neutral-600 text-right dark:text-neutral-50">
    <a
          href="#"
             className="text-[1.09788rem]  font-bold"
            tabIndex="0"
            role="link"
           >
             Muhd Ala
           </a>
           <br />
           <span className=" font-normal">~Student</span>
    </div>
  </div>
  )
}
