import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Sell = () => {
  const { userData, isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in?next=/sell");
    }
  }, [isAuth, navigate]);

  return (
    <div className="mt-20 px-6">
      <h1 className="text-[2rem] font-bold mb-4">Sell a Book</h1>
      <p className="text-[1rem] mb-6">Welcome, {userData?.email || "seller"}. Use this page to list your book for sale.</p>
      <div className="bg-white rounded-[1rem] shadow-md p-6">
        <p className="text-[#666]">This page is ready for backend selling flow integration.</p>
      </div>
    </div>
  );
};
