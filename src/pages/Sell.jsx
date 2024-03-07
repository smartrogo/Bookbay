import React, { useEffect } from "react";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { setUserId } from "../store/actions/userAction";
import { setBookId, clearBookId, removeBookId} from "../store/actions/bookAction";
import { AuthContext } from "../AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";

export const Sell = () => {
  const { userData } = useContext(AuthContext);
  const dispatch = useDispatch();
  const bookId = useSelector((state) => state.bookId);

  console.log(userData.email);

  useEffect(() => {
    const fetchUserIdByEmail = async () => {
      try {
        const q = query(
          collection(db, "userDetails"),
          where("email", "==", userData.email)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const user = querySnapshot.docs[0].id;
          dispatch(setUserId(user));
          console.log("User ID here:", user);
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserIdByEmail();
  }, [userData.email, dispatch]);

  useEffect(() => {
    // Move this dispatch outside of the return statement
    // dispatch(setBookId("books"));
     dispatch(clearBookId());
   
    
  }, [dispatch]);

  // dispatch(clearBookId());
  return (
    <div className="mt-20">
      sell <h1>Book ID: {bookId}</h1>
    </div>
  );
};
