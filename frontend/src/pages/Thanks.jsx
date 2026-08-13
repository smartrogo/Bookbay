import React from 'react';
import { useLocation } from "react-router-dom";
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const Thanks = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  return (
    <div className=' h-screen flex justify-center items-center'>
      <div>
      <h1>THANK YOU!</h1>
        <p>We have received your submission.</p>
        {email && <p>Email: {email}</p>}
        <Button onClick={() => navigate("/")} value="Go Back!" cls_name="bg-[#0F9D58] mx-auto w- rounded-[0.29656rem] md:rounded-[0.5rem] py-[0.37069rem] px-[0.92675rem] md:py-[0.625rem] md:px-[1.5625rem] text-center text-[#fff] poppins text-[0.66725rem] md:text-[1.125rem] text-style leading-normal font-normal capitalize"/>

      </div>
    </div>
  )
}
