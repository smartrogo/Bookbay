import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export const Buy = () => {
  const { userData, isAuth } = useContext(AuthContext);

  return (
    <div className="pt-24 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-4">Buy Books</h1>
        {isAuth ? (
          <>
            <p className="text-lg mb-3">Hello, {userData?.email || "BookBay user"}.</p>
            <p className="text-sm text-gray-600 mb-6">
              Use the marketplace to search for books, add them to your cart, and complete your purchase.
            </p>
            <Link to="/" className="inline-block bg-blue-600 text-white px-5 py-3 rounded-md">
              Browse Books
            </Link>
          </>
        ) : (
          <>
            <p className="text-lg mb-3">Sign in to access the BookBay marketplace.</p>
            <Link to="/sign-in" className="inline-block bg-blue-600 text-white px-5 py-3 rounded-md">
              Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
