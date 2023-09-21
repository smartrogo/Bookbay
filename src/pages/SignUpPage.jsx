import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export const SignUpPage = () => {
  return (
    <div className='h-screen flex items-center mt-20 justify-center'>
      <SignUp signInUrl='/sign-in'/>
    </div>
  )
}
