import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export const SignUpPage = () => {
  return (
    <div className='h-screen bg-green-500'>
      <h1>sign in page</h1>
      <SignUp signInUrl='/sign-in'/>
    </div>
  )
}
