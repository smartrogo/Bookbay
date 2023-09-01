import React from 'react'
import { SignIn, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export const SignInPage = () => {
  const { user } = useUser();
  const navigate = useNavigate()
  console.log(user);

   // If the user is already signed in, you can redirect them to another page
   if (user) {
    // Redirect to a protected page, for example
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className='h-screen bg-blue-500'>
        <SignIn path="/sign-in" routing="path" className=""/>
    </div>
  )
}
