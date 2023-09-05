import React from 'react'

export const ReasonCard = ({title, body, icon}) => {
  return (
    <div
    className="mr block box-sha rounded-[1rem] w-[20rem] md:w-[20.25rem] md:h-[17.8125rem] my-4 why mx-auto"
  >
    <div className="p-4 text-center">
      <div className="mx-auto flex items-center justify-center">
        <div className="border-2">
          <img src={icon} alt="illustration" className="pt-2 pb-4 w-[40%] mx-auto" />
          <span className=" uppercase icon outfit leading-[2rem] text-[1.5rem] text-style font-bold">{title}</span>
        </div>
      </div>
      <p className="my-4 para poppins text-[1rem] font-style font-normal leading-[1.2rem]">
        {body}
      </p>
    </div>
  </div>
  )
}
