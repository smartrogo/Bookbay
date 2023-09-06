import React from 'react';
import { UserProfile, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const Profile = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
          navigate("/sign-in");
        }
      }, [user, navigate]);
  return (
    <div>
        <UserProfile />
    </div>
  )
}
