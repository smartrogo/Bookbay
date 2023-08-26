import React from 'react'

export const Card = (props) => {
  return (
    <div>
        <div className="w-[17.61144rem] h-[18.755rem] md:w-[24.0625rem] md:h-[25.625rem] px-8 py-4 mt-[4.5rem] bg-[#eee] rounded-[0.73188rem] md:rounded-[1rem] box">
    <div className="flex justify-center -mt-16 md:justify-end">
        <img className="object-cover w-[6.03819rem] h-[6.03819rem] border-[3.66px] border-[#fff] rounded-[6.03819rem] border-solid" alt="Testimonial avatar" src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80" />
    </div>

    <p className="text-sm poppins relative mt-6 text-[0.91488rem] md:text-[1.25rem] italic font-normal leading-normal poppins text-[#000] text-center w-[12.03069rem] h-[6.49563rem] md:w-[16.4375rem] mx-auto md:h-[8.875rem]"><span className='text-[#666] font-bold text-[2.19569rem] absolute left-0 -top-1 md:top-1'>&#8220;</span><br/>{props.says}<br/><span className=' absolute right-2 top-28 md:top-[10rem] text-[#666] font-bold text-[2.19569rem]'>&#8220;</span></p>

    <div className="mt-14 md:mt-[7rem] text-style border-2 border-red-500 w-full capitalize text-end mr-8 leading-normal roboto text-[#000]">
        <a href="#" className="text-[1.09788rem]  font-bold" tabIndex="0" role="link">{props.name}</a><br/>
        <span className=' font-normal'>~{props.profession}</span>
    </div>
</div>
    </div>
  )
}
