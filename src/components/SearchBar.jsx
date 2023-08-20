import React, { useState } from "react";
import { SearchIcon } from "@heroicons/react/solid";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleToggle = () => {
    setShowInput(!showInput);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300 ease-in-out ${
            showInput ? "opacity-100" : "opacity-0"
          }`}
          placeholder="Search"
          value={query}
          onChange={handleChange}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleToggle}
          >
            <span className="sr-only">Toggle search input</span>
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
