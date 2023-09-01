import React from "react";
import { Text } from "./Text";
import Input from "./Input";
import { Button } from "./Button";
import { db} from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export const Newslatter = () => {
  const [email, setEmail] = useState("");
  const [loading, setIsloading] = useState(false);
  const [msg, setMsg] = useState("")

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setMsg("")
  };

  const collectionName = 'subscribers';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      setMsg('Please, provide an Email address')
       // Automatically remove the error message after 5 seconds
       setTimeout(() => {
        setMsg("");
      }, 5000);
      return false
    }
    setIsloading(true)
    try {
      const docRef = collection(db, collectionName);

      const docData = {
        email: email,
      }
      await addDoc(docRef, docData)

      toast.success("Subscription successful! 🎉", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        style: {
          fontSize: "14px"
        }
      })
      setEmail("");
    } catch (error) {
      console.error('Error adding subscriber: ', error)
      toast.error("something went wrong, try again!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        style: {
          fontSize: "14px"
        }
      })
    }
    setIsloading(false)
  };

  useEffect(() => {
    // Automatically remove the error message after 5 seconds
    const timeoutId = setTimeout(() => {
      setMsg("");
    }, 5000);

    return () => {
      // Clear the timeout if the component unmounts or if a new error occurs
      clearTimeout(timeoutId);
    };
  }, [msg]);


  return (
    <div className="flex items-center justify-end mb-10 mx-auto">
      <div className="w-[88%] md:w-[60%] mx-auto">
        <div className="mx-auto flex flex-col items-center ">
          <div className="mt-0">
            <Text
              head="Subscribe To Our Newsletter"
              body="Lorem ipsum dolor sit amet consectetur. Diam ut feugiat aliquet in varius feugiat magna dictum. Tortor diam et placerat."
            />
          </div>

        
            <div className="w-full mx-auto">
            <form onSubmit={handleSubmit} >
              <Input
                id="email"
                name="email"
                value={email}
                onChange={handleEmail}
                label_cls_name="leading-normal poppins capitalize text-[0.66725rem] font-normal"
                type="email"
                placeholder="example@gmail.com"
                cls_name="w-[100%] mx-auto card rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#0F9D58] focus:ring-[2px] focus:ring-[#abeacc] text-base outline-none text-[#696969] py-1 mt-4 md:-mt-10 placeholder:text-center px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
              {msg ? <p className="text-red-500">{msg}</p> : ""}
              <Button
                value="subscribe"
                cls_name={
                  loading ? "bg-[#85edba] cursor-not-allowed mx-auto w-full rounded-[0.29656rem] md:rounded-[0.5rem] py-[0.37069rem] px-[0.92675rem] md:py-[0.625rem] md:px-[1.5625rem] text-center text-[#fff] poppins text-[0.66725rem] md:text-[1.125rem] text-style leading-normal font-normal capitalize" :
                  "bg-[#0F9D58] mx-auto w-full rounded-[0.29656rem] md:rounded-[0.5rem] py-[0.37069rem] px-[0.92675rem] md:py-[0.625rem] md:px-[1.5625rem] text-center text-[#fff] poppins text-[0.66725rem] md:text-[1.125rem] text-style leading-normal font-normal capitalize"
                }
              />
          </form>
          <ToastContainer />
            </div>
        </div>
      </div>
    </div>
  );
};
