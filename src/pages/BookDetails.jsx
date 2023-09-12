import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

export const BookDetails = () => {
  const { bookId } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch book details based on bookId
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `https://openlibrary.org/works/${bookId}.json`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data for book ${bookId}`);
        }

        const data = await response.json();
        setBookDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

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

  if (!bookDetails) {
    return <div>Book not found.</div>;
  }

  return (
    <div className="book-details">
      <img
        src={`https://covers.openlibrary.org/b/id/${bookDetails.cover_id}-L.jpg`}
        alt={bookDetails.title}
      />
      <p>Title: {bookDetails.title}</p>
      <p>Year: {bookDetails.first_publish_year}</p>
      <p>
        Author: {bookDetails.authors ? bookDetails.authors[0].name : "Unknown"}
      </p>
    </div>
  );
};
