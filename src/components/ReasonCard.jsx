import React from 'react'

export const ReasonCard = ({title, body, icon, cls_name, text_color}) => {
  return (
    <div
    className={cls_name}
  >

    <div className="p-4">
      <div className="">
        
        <div className="">
          <img src={icon} alt="illustration" className="w-[2.88206rem] h-[2.93644rem] mb-2" />
          <span style={{color: `${text_color}`}} className=" my-8 icon outfit leading-[2rem] text-[1.30506rem] text-style font-bold">{title}</span>
        </div>

      </div>
      <p className="mt-2 capitalize poppins text-[0.87006rem] font-style font-normal leading-[1.04406rem]">
        {body}
      </p>
    </div>

  </div>
  )
}
