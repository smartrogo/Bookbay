import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export const SignUpPage = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
      <SignUp signInUrl='/sign-in'/>
    </div>
  )
}
