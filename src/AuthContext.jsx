import { createContext } from "react";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import React from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [isAuth, setIsAuth] = useState(false);

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

  const contextData = {
    isAuth,
    userData: userData,
    setUserData,
    isLoading,
    setIsLoading,
    setIsAuth,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
