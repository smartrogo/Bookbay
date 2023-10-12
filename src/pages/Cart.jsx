import React from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { doc, deleteDoc } from "firebase/firestore";

export const Cart = () => {
  const { userData } = useContext(AuthContext);
  const [myCartBooks, setMyCartBooks] = useState([]);
  const getMyBooks = async () => {
    const q = query(
      collection(db, "cart"),
      where("email", "==", userData?.email)
    );
    const querySnapshot = await getDocs(q);
    let res = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      res = [...res, { ...doc.data(), id: doc.id }];
    });
    setMyCartBooks(res);
    console.log(myCartBooks);
  };

  useEffect(() => {
    getMyBooks();
    console.log("im cart");
  }, []);

  const deleteBook = async (id) => {
    console.log("id: ", id);
    await deleteDoc(doc(db, "cart", id));
    getMyBooks();
  };
  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <h1 className="text-2xl text-center">My Cart</h1>
      <div className="flex justify-start flex-wrap p-6 gap-3">
        {myCartBooks.map((item, index) => (
          <div
            key={index}
            className="w-52 border-blue-700 border-2 box-content"
          >
            <img
              src={`https://covers.openlibrary.org/b/id/${item.cover}-L.jpg`}
              alt={item.title}
            />
            <h4 className="text">title: {item.title}</h4>
            <p>author: {item.author}</p>
            <button onClick={() => deleteBook(item.id)}>delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};
