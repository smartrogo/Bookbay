import React, { useRef } from "react";
import { Button } from "./Button";
import Input from "./Input";
import stay from "../assets/stay.png";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailjs from "@emailjs/browser";

export const Contact = () => {
  const form = useRef();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessge] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setMsg("");
  };
  const handleName = (e) => {
    setName(e.target.value);
    setMsg("");
  };
  const handleMessage = (e) => {
    setMessge(e.target.value);
    setMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("hi, men");
    if (email.trim() === "" || name.trim() === "" || message.trim() === "") {
      // console.log("you typed nothing");
      // setMsg("Please fill the form");
      // Automatically remove the error message after 5 seconds
      setTimeout(() => {
        setMsg("");
      }, 5000);
      return false;
    }
    setIsLoading(true);
    try {
      await emailjs.sendForm(
        "service_6lmh19j",
        "template_au3nprc",
        form.current,
        "ZyNtOz72PPazwE0s7"
      );
      toast.success("message sent, \n will get back to you!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        style: {
          fontSize: "14px",
        },
      });
      setEmail("");
      setName("");
      setMessge("");
    } catch (error) {
      console.log(error);
      toast.error("something went wrong, try again", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        style: {
          fontSize: "14px",
        },
      });
    }
    setIsLoading(false);
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
    <section className="relative my-10">
      <img
        src={stay}
        alt="background svg"
        className="absolute w-[34.80581rem] md:right-[14.5rem] md:-top-[3.9rem]"
      />
      <div className="w-[94.5%] md:w-[75%] px-5 md:px-12 pb-4 md:pb-10 mx-auto flex sm:flex-nowrap flex-wrap">
        <div className="lg:w-1/2 flex flex-col w-full md:py-8 mt-8 md:mt-0">
          <form onSubmit={handleSubmit} ref={form}>
            <h2 className=" poppins text-[1.03794rem] md:text-[1.75rem] text-style mb-1 font-bold leading-normal title-font capitalize text-[#0000FF]">
              contact us
            </h2>

            <Input
              label="Email:"
              id="email"
              name="email"
              value={email}
              onChange={handleEmail}
              label_cls_name="leading-normal poppins capitalize text-[0.66725rem] font-normal"
              type="email"
              placeholder="example@gmail.com"
              cls_name="w-full bg-[#EEE] rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#4b4be6] focus:ring-[2px] focus:ring-[#9a9ae6] text-base outline-none text-[#696969] py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />

            <Input
              label="Name:"
              id="name"
              name="name"
              value={name}
              onChange={handleName}
              label_cls_name="leading-normal poppins capitalize text-[0.66725rem] font-normal"
              cls_name="w-full bg-[#eee] rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#4b4be6] focus:ring-[2px] focus:ring-[#9a9ae6] text-base outline-none text-[#696969] py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              type="text"
              placeholder="Muhammad Ni'imatullahi"
            />

            <div className="relative mb-4">
              <label
                htmlFor="message"
                className="leading-normal poppins capitalize text-[0.66725rem] font-normal"
              >
                Message:
              </label>

              <textarea
                id="message"
                name="message"
                value={message}
                onChange={handleMessage}
                className="w-full bg-[#eee] rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#4b4be6] focus:ring-[2px] focus:ring-[#9a9ae6] h-32 text-base outline-none text-[#696969] py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                placeholder="Your Message"
              ></textarea>
            </div>
            {msg ? <p style={{ color: "#ef4461" }}>{msg}</p> : ""}

            <Button
              type="submit"
              value="send"
              cls_name={
                loading
                  ? "mx-auto rounded-[0.29656rem] md:rounded-[0.5rem] py-[0.37069rem] px-[0.92675rem] md:py-[0.625rem] md:px-[1.5625rem] text-center text-[#fff] poppins text-[0.66725rem] md:text-[1.125rem] text-style leading-normal font-normal capitalize"
                  : "bg-transparent border-[2px] border-solid border-[#00f] mx-auto btn rounded-[0.29656rem] md:rounded-[0.5rem] py-[0.37069rem] px-[0.92675rem] md:py-[0.625rem] md:px-[1.5625rem] text-center text-[#00f] poppins text-[0.66725rem] md:text-[1.125rem] text-style leading-normal font-normal capitalize"
              }
            />
          </form>
          <ToastContainer />
        </div>
      </div>
      <hr className=" h-[1px] mx-auto w-[90%] border-[#333] " />
    </section>
  );
};
