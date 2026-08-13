import React, { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export const Profile = () => {
  const { userData, isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in?next=/profile");
    }
  }, [isAuth, navigate]);

  if (!isAuth) {
    return null;
  }

  return (
    <div className="pt-24 px-6">
      <h1 className="text-[2rem] font-bold mb-4">Profile</h1>
      <p className="text-[1rem] text-[#333] mb-2">Email: {userData?.email}</p>
      <p className="text-[1rem] text-[#333] mb-2">User ID: {userId || userData?.id || userData?.userId}</p>
      <p className="text-[1rem] text-[#666]">This profile page is now using backend auth state instead of Clerk.</p>
    </div>
  );
};
