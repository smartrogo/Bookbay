import React from 'react';
import {  useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom'; // Import Navigate
import { useEffect } from 'react';
export const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        if (!user) {
          navigate("/");
        }
      }, [user, navigate]);
    return (
        <div className='bg-yellow-500'>
            <h1 className='mt-20'>dashboard</h1>
        </div>
    )
}
