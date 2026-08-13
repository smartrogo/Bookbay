// CartItem.js

import React from "react";
import {Button} from "../components/Button"; // You might need to adjust the import path

const CartItem = ({ myCartBooks, deleteBookWithConfirmation }) => {
  return (
    <div className="border-2 bg-[#fff] py-[1rem] px-[0.5rem] md:py-[3.125rem] md:px-[5.4375rem] mx-auto border-red-500 flex flex-col gap-8">
      {myCartBooks.map((item, index) => (
        <div key={index} className="box-content flex gap-10 bg-[#fff] rounded-[0.9375rem] shwd">
          <div className="w-full p-2 border-2">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between">
              <div className="flex md:justify-center items-center">
                <img
                  src={`https://covers.openlibrary.org/b/id/${item.cover}-L.jpg`}
                  alt={item.title}
                  className="w-[5rem] h-[5.14288rem] object-scale-down"
                />
                <div className="text-[#1E1E1E]">
                  <span className="text  font-medium text-[1.125rem] text-style leading-normal">title: {item.title}</span>
                  <p className="text-[0.75rem] font-normal leading-normal capitalize text-style">Only for sale</p>
                </div>
              </div>
              <div className="flex md:justify-center items-center gap-6">
                <Button value="Buy: $681" cls_name="text-[0.80rem] btn md:text-[1rem] font-medium bg-[#0000FF] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]" />
                <Button value="Borrow:$81" cls_name="text-[0.80rem] btn md:text-[1rem] font-medium bg-[#DAA520] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]" />
                <button onClick={() => deleteBookWithConfirmation(item.id)}>
                  <img src={trash} alt="Delete" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItem;
