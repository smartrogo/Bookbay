import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ placeholder }) => {
  return (
    <div className="relative w-full max-w-md mx-auto my-4">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full py-2 px-4 md:py-[1rem] md:px-[1.5em] rounded-[1.5rem] outline-none focus:border-[#0F9D58] focus:ring-[2px] focus:ring-[#abeacc] poppins text-base transition-colors duration-200 ease-in-out card"
      />
      <div className="absolute top-0 right-2 flex items-center h-full pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
    </div>
  );
};

export default SearchInput;
