import React from 'react'
import { SignIn, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const SignInPage = () => {
  const { user } = useUser();
  const navigate = useNavigate()
  console.log(user);
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  return (
        <div className='flex justify-center items-center mt-10 h-[100vh]'>
        <SignIn className="border-2 border-red-500" path="/sign-in" routing="path" signUpUrl='/sign-up'/>
        </div>
  )
}
