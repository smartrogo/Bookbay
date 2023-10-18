// PaymentModal.js
import React from "react";
import { Button } from "./Button";

const PaymentModal = ({ show, handleClose }) => {
  return show ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-600 bg-opacity-50">
      <div className="modal-bg bg-white p-6 rounded-md w-[48rem] ">
        <h2 className="text-[1.5rem] font-bold text-[#333] mb-4">Payment Method</h2>

        <div>
            Checkedout!<br/>
            Thank you for using our services 🎉
        </div>

        {/* Add your payment method selection UI here */}

        <div className="mt-4 flex justify-end">
          <Button
            value="Close"
            cls_name="text-[0.80rem] btn hover:bg-gray-200 md:text-[1rem] font-medium bg-red-white rounded-[0.25rem] md:rounded-[0.3125rem] text-gray-500 py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"
            onClick={handleClose}
          />
        </div>
      </div>
    </div>
  ) : null;
};

export default PaymentModal;
