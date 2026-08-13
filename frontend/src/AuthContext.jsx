import { createContext, useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCurrentUser,
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
} from "./services/authService";

export const AuthContext = createContext(null);

/**
 * Flexible admin detection that tolerates different backend response
 * shapes: { role: "admin" }, { role_id: 1 }, { is_admin: true },
 * { roles: [{ name: "admin" }] } etc.
 */
export const isAdminUser = (user) => {
  if (!user) return false;
  if (user.is_admin === true || user.isAdmin === true) return true;
  if (typeof user.role === "string") return user.role.toLowerCase() === "admin";
  if (typeof user.role === "number") return user.role === 1;
  if (user.role_id === 1 || user.roleId === 1) return true;
  if (Array.isArray(user.roles)) {
    return user.roles.some((r) => {
      const name = r?.name || r?.role || (typeof r === "string" ? r : "");
      return String(name).toLowerCase() === "admin";
    });
  }
  return false;
};

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem("isAuth") === "true");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const persistAuthState = (user) => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
      localStorage.setItem("isAuth", "true");
    } else {
      localStorage.removeItem("authUser");
      localStorage.removeItem("isAuth");
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetchCurrentUser();
        const user = response.user || response.data?.user || response;
        setUserData(user);
        setIsAuth(true);
        persistAuthState(user);
      } catch (error) {
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          setIsAuth(true);
          persistAuthState(parsedUser);
        } else {
          setUserData(null);
          setIsAuth(false);
          persistAuthState(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (credentials) => {
    const response = await authSignIn(credentials);
    const user = response.user || response.data?.user || response;
    setUserData(user);
    setIsAuth(true);
    persistAuthState(user);
    return response;
  };

  const signUp = async (credentials) => {
    const response = await authSignUp(credentials);
    const user = response.user || response.data?.user || response;
    setUserData(user);
    setIsAuth(true);
    persistAuthState(user);
    return response;
  };

  const logOut = async () => {
    try {
      await authSignOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUserData(null);
    setIsAuth(false);
    persistAuthState(null);
    navigate("/");
  };

  const contextData = {
    isAuth,
    userData,
    setUserData,
    isLoading,
    setIsLoading,
    setIsAuth,
    isAdmin: isAdminUser(userData),
    signIn,
    signUp,
    logOut,
    errorMsg,
    setErrorMsg,
  };

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};
