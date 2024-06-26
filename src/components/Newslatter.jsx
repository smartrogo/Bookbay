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
import { useNavigate } from "react-router-dom";
import { LoadingBtn } from "./LoadingBtn";

export const Newslatter = () => {
  const navigate = useNavigate()
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

      // toast.success("Subscription successful! 🎉", {
      //   position: toast.POSITION.TOP_CENTER,
      //   autoClose: 3000,
      //   style: {
      //     fontSize: "14px"
      //   }
      // })
      navigate(`/thank?email=${encodeURIComponent(email)}`);
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
              body="Join our community and never miss out! Subscribe to our newsletter for the latest updates, exclusive content, special offers, and more. Stay connected with us!"
            />
          </div>

        
            <div className="w-full md:w-[60%] mx-auto">
            <form onSubmit={handleSubmit} >
              <Input
                id="email3"
                name="email"
                value={email}
                onChange={handleEmail}
                label_cls_name="leading-normal poppins capitalize text-[0.66725rem] font-normal"
                type="email"
                placeholder="example@gmail.com"
                cls_name="w-full mx-auto bg-[#EEE] rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#4b4be6] focus:ring-[2px] focus:ring-[#9a9ae6] text-base outline-none text-[#696969] py-1 mt-4 md:-mt-10 placeholder:text-center px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
              {msg ? <p style={{color: "#ef4461"}}>{msg}</p> : ""}
              {loading ? <Button loading={loading} value="subscribing" cls_name="bg-transparent border-[2px] border-solid border-[#00F] btn mx-auto w-full rounded-[0.29656rem] md:rounded-[0.5rem] py-[0.85rem] px-[0.92675rem] md:py-[0.60rem] md:px-[1.5625rem] text-center text-[#00f] poppins text-[0.76725rem] md:text-[1.125rem] text-style leading-normal font-normal capitalize text-[0.59381rem]"/> :  <Button
                value="subscribe"
                cls_name={
                  "bg-transparent border-[2px] border-solid border-[#00F] btn mx-auto w-full rounded-[0.29656rem] md:rounded-[0.5rem] py-[0.85rem] px-[0.92675rem] md:py-[0.60rem] md:px-[1.5625rem] text-center text-[#00f] poppins text-[0.76725rem] md:text-[1.125rem] text-style leading-normal font-normal capitalize text-[0.59381rem]"
                }
              /> }
           
          </form>
          <ToastContainer />
            </div>
        </div>
      </div>
    </div>
  );
};
