import React from "react";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute = () => {
  const { isAuth } = useContext(AuthContext);

  const location = useLocation();
  const path = location.pathname;

  const link = `/sign-in?next=${path}`;

  return isAuth ? <Outlet /> : <Navigate to={link} />;
};
