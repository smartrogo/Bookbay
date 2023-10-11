import { createContext } from "react";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user", user, user.photoURL);
        setIsAuth(true);
        setUserData((data) => ({
          ...data,
          pic: user.photoURL,
          displayName: user.displayName,
          email: user.email,
        }));
      } else {
        console.log("no authenticated");
      }
      setIsLoading(false);
    });
  }, []);
  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("coming to logout");
        localStorage.removeItem("isAuth");
        window.location.reload;
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
        console.log(error, ":an error occured");
      });
  };
  const contextData = {
    isAuth,
    userData: userData,
    setUserData,
    isLoading,
    setIsLoading,
    setIsAuth,
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
