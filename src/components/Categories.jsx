import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

export const Categories = () => {
  const { category } = useParams(); // Get the category from the URL
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  return (
    <div>

    </div>
  )
}
