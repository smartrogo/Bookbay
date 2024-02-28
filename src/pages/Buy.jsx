import React from "react";
import { useSelector } from "react-redux";


export const Buy = () => {
  const userId = useSelector((state) => state.userReducer.userId);
 

  

  return <div>Buy {userId}</div>;
};
