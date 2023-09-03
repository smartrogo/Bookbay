import React from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { useNavigate, Navigate } from 'react-router-dom'; // Import Navigate

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    // If the user is not signed in, redirect them to the custom sign-in page
    if (!user) {
        // Redirect to the custom sign-in page
        return <Navigate to="/sign-in" />; // Use the Navigate component
    }
    return (
        <div className='bg-yellow-500'>
            <h1 className='mt-20'>Protected page</h1>
            <UserButton />
        </div>
    )
}
