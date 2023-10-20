import React, { useState } from 'react';

const Accordion = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className=" bg-[#eee] rounded-[0.5rem] my-4 p-6">
      <div
        className="p-4 flex justify-between cursor-pointer"
        onClick={toggleAccordion}
      >
        <div>
           <p className="text-[#000] outfit text-[1rem] font-normal leading-normal md:text-[1.5rem] capitalize"> {question}</p>

        </div>
        
        <div
          className={`transform transition-transform ${
            isExpanded ? 'rotate-90' : ''
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      <hr className=" h-[1px] mx-auto w-full border-[#333] mt-2 mb-4" />
      <div
        className={`overflow-hidden transition-max-h ${
          isExpanded ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 mt-4 bg-[#fff] border-l-8 rounded-[0.25rem] border-[#31AF31] mx-auto">
            <p className='text-[0.875rem] font-normal text-style leading-normal md:text-bold md:text-[1.25rem]'>{answer}</p>
            </div>
      </div>
    </div>
  );
};

export default Accordion;
