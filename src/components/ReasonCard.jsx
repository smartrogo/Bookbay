import React from 'react'

export const ReasonCard = ({title, body, icon, cls_name, text_color}) => {
  return (
    <div
    className={cls_name}
  >

    <div className="px-4 py-[3rem]">
      <div className="">
        
        <div className="">
          <img src={icon} alt="illustration" className="w-[2.88206rem] h-[2.93644rem] md:w-[3.3125rem] md:h-[3.375rem] mb-2" />
          <span style={{color: `${text_color}`}} className=" my-8 icon outfit leading-[2rem] text-[1.30506rem] text-style font-bold">{title}</span>
        </div>

      </div>
      <p className="mt-2 w-[16.15044rem] h-[4.13275rem] md:h-[4.6875rem] md:w-[18.4375rem] capitalize text-[0.87006rem] md:text-[1rem] font-style font-normal 
      leading-[20px]">
        {body}
      </p>
    </div>

  </div>
  )
}
