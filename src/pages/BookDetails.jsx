import React, { useState, useEffect, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export const BookDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { title, author, cover, year } = Object.fromEntries(searchParams);
  console.log(title, author, cover, year, "det");
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("userData: ".userData);

  if (loading) {
    return (
      <div>
        <Skeleton height={250} width="100%" />
        <Skeleton height={20} width="80%" />
        <Skeleton height={20} width="50%" />
        <Skeleton height={20} width="70%" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const addToCart = async () => {
    await addDoc(collection(db, "cart"), {
      email: userData?.email,
      title,
      author,
      cover,
    });
    navigate("/protected");
  };
  return (
    <div className="book-details">
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1>{userData.email}</h1>
      <img
        src={`https://covers.openlibrary.org/b/id/${cover}-L.jpg`}
        alt={title}
      />
      <p>Title: {title}</p>
      <p>Year: {year}</p>
      <p>Author: {author}</p>
      <button onClick={() => addToCart()}>add to cart</button>
    </div>
  );
};
