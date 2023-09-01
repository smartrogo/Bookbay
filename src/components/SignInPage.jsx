import React from 'react'
import { SignIn } from '@clerk/clerk-react'

export const SignInPage = () => {
  return (
    <div className='h-screen'>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" className="mt-24"/>
    </div>
  )
}
