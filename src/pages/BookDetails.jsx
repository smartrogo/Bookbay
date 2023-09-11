import React from 'react'
import { useParams } from "react-router-dom";
export const BookDetails = () => {
    const { bookId } = useParams();
  return (
    <div>
         <h2>Book Details</h2>
    </div>
  )
}
