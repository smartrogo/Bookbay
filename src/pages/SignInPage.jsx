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
    <div className='h-screen bg-blue-500'>
        <SignIn path="/sign-in" routing="path" className=""/>
    </div>
  )
}
