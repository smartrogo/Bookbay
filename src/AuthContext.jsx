import { createContext } from "react";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, deleteUser, updatePassword } from "firebase/auth";
import { auth } from "./firebase";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem("isAuth"));
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();


  // const currentUr = auth.currentUser;
  // console.log(currentUr, "hi")

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
        // console.log("no authenticated");
      }
      setIsLoading(false);
    });
  }, []);

  const logOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("isAuth", false);
        setIsAuth(false);
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
        console.log(error, ":an error occured");
      });
  };

  const deleteUserAccount = () => {
    const user = auth.currentUser;
    // TODO(you): prompt the user to re-provide their sign-in credentials

    if (user) {
      // Check if the user's token is still valid (within the last 5 minutes).
      // If not, you need to re-authenticate the user before deleting their account.
      user
        .getIdTokenResult()
        .then((idTokenResult) => {
          const authTime = idTokenResult.claims.auth_time;
          const now = Math.floor(Date.now() / 1000);

          if (now - authTime <= 2400) {
            // 300 seconds (40 minutes)
            deleteUser(user)
              .then(() => {
                localStorage.setItem("isAuth", false);
                setIsAuth(false);
                navigate("/");
              })
              .catch((error) => {
                console.error("Error deleting user:", error);
              });
          } else {
            // The user's authentication has expired. Re-authenticate them.
            // You can navigate to a re-authentication page or trigger a re-authentication flow.
            console.log("User's authentication has expired. Re-authenticate.");
            setErrorMsg("User's authentication has expired. Re-authenticate.")
            
          }
        })
        .catch((error) => {
          console.error("Error checking token validity:", error);
        });
    }
  };

  const ChangePassword = async (newPassword) => {
    const user = auth.currentUser;
  
    // Check if the user is signed in
    if (user) {
      try {
        // Call the Firebase Authentication method to update the password
        await updatePassword(user, newPassword);
        console.log("Password updated successfully");
      } catch (error) {
        if (error.code === "auth/requires-recent-login") {
          throw new Error("Please reauthenticate to change your password");
        } else {
          throw error;
        }
      }
    } else {
      throw new Error("User is not signed in");
    }
  };  

  const contextData = {
    isAuth,
    userData: userData,
    setUserData,
    isLoading,
    setIsLoading,
    setIsAuth,
    logOut,
    deleteUserAccount,
    ChangePassword
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
