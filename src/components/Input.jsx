import React from "react";

const Input = ({ label, id, name, type, placeholder }) => {
  return (
    <div className="relative mb-4">
      <label
        htmlFor={id}
        className="leading-normal poppins capitalize text-[0.66725rem] text-[#000] font-normal"
      >
        {label}:
      </label>

      <input
        type={type}
        id={id}
        name={name}
        className="w-full bg-[#eee] rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#0F9D58] focus:ring-[2px] focus:ring-[#abeacc] text-base outline-none text-[#696969] py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
