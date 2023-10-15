import React from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { doc, deleteDoc } from "firebase/firestore";
import { Button } from "../components/Button";
import CartItem from "../components/CartItem";
import trash from "../assets/trash.svg"
import { Footer } from "../components/Footer";
import PaymentModal from "../components/PaymentModal";
export const Cart = () => {
  const { userData } = useContext(AuthContext);
  const [myCartBooks, setMyCartBooks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control the delete confirmation modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

   const getMyBooks = async () => {
    
  if (userData && userData.email) { // Check if userData and email are defined
    const q = query(
      collection(db, "cart"),
      where("email", "==", userData.email) // Use userData.email if defined
    );
    const querySnapshot = await getDocs(q);
    let res = [];
    querySnapshot.forEach((doc) => {
      res = [...res, { ...doc.data(), id: doc.id }];
      const total = res.length
      console.log(total)
    });
    setMyCartBooks(res);
    console.log(res.length);
  }
  };

  useEffect(() => {
    getMyBooks();
    console.log("im cart");
  }, []);

  // const deleteBook = async (id) => {
  //   console.log("id: ", id);
  //   await deleteDoc(doc(db, "cart", id));
  //   getMyBooks();
  // };

 
  const handleShowPaymentModal = () => {
    setShowPaymentModal(true);
  };

  const handleHidePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const deleteBookWithConfirmation = (id) => {
    setBookToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (bookToDelete) {
      await deleteDoc(doc(db, "cart", bookToDelete));
      setBookToDelete(null);
      setShowDeleteModal(false);
      getMyBooks();
    }
  };

  const isCartEmpty = myCartBooks.length === 0;

  const CartItem = () => {
    return(
      <div className="border-2 bg-[#fff] py-[1rem] px-[0.5rem] md:py-[3.125rem] md:px-[5.4375rem] mx-auto border-red-500 flex flex-col gap-8">


            {myCartBooks.map((item, index) => (
          <div
            key={index}
            className="box-content flex gap-10 bg-[#fff] rounded-[0.9375rem] shwd"
          >

<div className="w-full p-2 border-2">

<div className="flex flex-col gap-4 md:flex-row md:justify-between">
<div className="flex md:justify-center items-center">
          <img
              src={`https://covers.openlibrary.org/b/id/${item.cover}-L.jpg`}
              alt={item.title}
              className="w-[5rem] h-[5.14288rem] object-scale-down"
            />

            <div className="text-[#1E1E1E]">
            <span className="text  font-medium text-[1.125rem] text-style leading-normal">title: {item.title}</span>
            <p className="text-[0.75rem] font-normal leading-normal capitalize text-style">Only for sale</p>
            </div>
          </div>

              <div className="flex md:justify-center items-center gap-6">
                <Button value="Buy: $681" cls_name="text-[0.80rem] btn md:text-[1rem] font-medium bg-[#0000FF] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"/>

                <Button value="Borrow:$81" cls_name="text-[0.80rem] btn md:text-[1rem] font-medium bg-[#DAA520] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"/>

                <button onClick={() => deleteBookWithConfirmation(item.id)}>
                    <img src={trash} />
                  </button>
              </div>
</div>
</div>
         
           
          </div>
        ))}

{showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-600 bg-opacity-50">
            <div className="modal-bg bg-white p-6 rounded-md">

              <div className="flex items-center p-3 mb-4 text-[0.8rem] text-red-800 rounded-[0.25rem] bg-red-50" role="alert">
  <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <span className="sr-only">Info</span>
  <div>
   <span className="text-red-400">Are you sure you want to delete this book from your cart?</span>
  </div>
</div>
              <div className="mt-4 flex gap-4">

                <Button value="Cancel" onClick={() => setShowDeleteModal(false)} cls_name="text-[0.80rem] btn hover:bg-gray-200 md:text-[1rem] font-medium bg-red-white rounded-[0.25rem] md:rounded-[0.3125rem] text-gray-500 py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"/>

                <Button value="Delete" onClick={confirmDelete} cls_name="text-[0.80rem] btn hover:bg-red-600 md:text-[1rem] font-medium bg-red-500 rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"/>

              </div>

            </div>
          </div>
        )}
      </div>
    )

    
  }

  

  

  return (
    <div className="pt-20 h-screen">
      <div className=" border-2 w-[90%] mx-auto">
      <h1 className="text-[#000] capitalize font-bold test-style outfit text-[3rem] leading-normal">cart management </h1>
      <p className="text-[#1E1E1E] text-[1rem] text-style font-medium leading-normal">{`You have ${myCartBooks.length} item in your cart`}</p>

    {isCartEmpty ? <p>You haven't added anything to your cart!</p> : (
      <div className="border-2 border-green-500 w-full mx-auto bg-[#F5F5F5] rounded-[0.9375rem]">
      <CartItem />
      </div>)}

      {/* {isCartEmpty ? (
            <p>You haven't added anything to your cart!</p>
          ) : (

          )} */}

      </div>

     <div className="mt-14 flex justify-center items-center">

    {!isCartEmpty && ( <Button  onClick={handleShowPaymentModal} value="Go to Checkout" cls_name="text-[0.80rem] btn md:text-[1rem] font-medium bg-[#31AF31] px-[5rem] py-[1.2rem] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem]  poppins text-center text-style capitalize  text-center flex items-center leading-[1.23713rem] md:leading[0.62181rem]"/>)}
    

     </div>
     <PaymentModal show={showPaymentModal} handleClose={handleHidePaymentModal} />

     <Footer />
    
    </div>
  );
};