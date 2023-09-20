import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ placeholder, value, onChange }) => {
  return (
    <div className="relative w-full max-w-md mx-auto my-4 flex justify-center items-center">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-[90%] mx-auto py-2 px-4 md:py-[1rem] md:px-[1.5em] rounded-[1.5rem] outline-none focus:border-[#0F9D58] focus:ring-[2px] focus:ring-[#abeacc] poppins text-base transition-colors duration-200 ease-in-out card"
      />
      <div className="absolute top-0 right-8 flex items-center h-full pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
    </div>
  );
};

export default SearchInput;
