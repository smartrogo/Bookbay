import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export const SignUpPage = () => {
  return (
    <div className='h-screen bg-green-500'>
    <SignUp path="/sign-up" routing="path"  className=""/>
</div>
  )
}
