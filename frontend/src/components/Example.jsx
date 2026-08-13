import React from 'react';
import { SignInButton } from "@clerk/clerk-react";

export const Example = () => {
  return (
    <div>
         <h1> Sign in </h1>
      <SignInButton redirectUrl='/sign-in'/>
    </div>
  )
}
