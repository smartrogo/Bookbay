import React from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../AuthContext";

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
      res = [...res, doc.data()];
    });
    setMyCartBooks(res);
  };

  useEffect(() => {
    getMyBooks();
    console.log("im cart");
  }, []);

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <h1 className="text-2xl text-center">My Cart</h1>
      <div className="flex justify-between flex-wrap p-6">
        {myCartBooks.map((item, index) => (
          <div key={index} className="w-28 border-blue-700 border-2">
            <h4>{item.title}</h4>
            <img
              src={`https://covers.openlibrary.org/b/id/${item.cover}-L.jpg`}
              alt={item.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
