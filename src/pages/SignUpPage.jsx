import google from "../assets/audio.svg";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { LoadingBtn } from "../components/LoadingBtn";
import React from "react";

export const SignUpPage = () => {
  const [show, setShow] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    // console.log("show", show);
  });

  const toggle = (bool) => {
    // console.log("boolin", bool);
    setShow(bool);
  };

  // new user function
  const signUp = async (values) => {
    setIsLoading(true);
    await createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user, "creaded");
        navigate("/");
        console.log("after navigate");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-exists") {
          setErrorMsg("email-already-exists");
          console.log(error.code);
        }
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      })
      .finally(() => {
        setIsLoading(false); // Set loading state to false after login process completes
      });
  };

  // google sign up
  const signUpWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        navigate("/");
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  // handling form submition and clearing inputs
  const handleFormSubmit = (values, { resetForm }) => {
    // creating new user
    signUp(values);

    // form reset
    // resetForm();
  };

  // formik object
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
    },
    // yup validation schema
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(3, "Must be at least 3 characters")
        .max(15, "Must be 15 characters or less")
        .required("required"),
      lastName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .min(3, "Must be at least 3 characters")
        .required("required"),
      userName: Yup.string()
        .max(15, "Must be at most 15 characters")
        .min(3, "Must be at least 3 characters")
        .required("required")
        .matches(
          /^[a-zA-Z0-9_]+$/,
          "Username can only contain alphanumeric characters and underscores"
        ),
      email: Yup.string()
        .matches(
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          "Invalid email address"
        )
        .required("required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]+$/,
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
        ),
    }),
    // submittion
    onSubmit: handleFormSubmit,
  });

  // Abcd123!
  return (
    <div>
      <section className="md:mt-[5.2rem] mt-[6rem]">
        <div className="flex flex-col md:mt-0 mt-[1.2rem] items-center px-4 md:px-6 py-8 mx-auto lg:py-0">
          <div className="w-full rounded-lg shadow border-[1px] border-zinc md:mt-0 sm:max-w-[30rem] xl:p-0">
            <div className="p-3 md:p-6 space-y-4 sm:p-4">
              <div className="login-section">
                <h1 className="text-4xl md:text-5xl center mb-4 text-white">
                  Create Account
                </h1>
                <p className="center text-white">
                  Already have an account{" "}
                  <NavLink
                    to="/accounts/login"
                    className="underline text-brand-teal"
                  >
                    Log in
                  </NavLink>
                </p>
                <NavLink
                  to="#"
                  onClick={() => signUpWithGoogle()}
                  className="rounded-full bg-white  hover:bg-opacity-30 
            shadow-md hover:shadow-lg px-4 py-2 text-zinc 
            font-medium my-4 flex justify-around w-60 items-center"
                >
                  <img src={google} alt="google" className="w-8" />
                  Sign up with Google
                </NavLink>{" "}
              </div>
              <div className="or text-center text-white">
                <hr />
                <span className="center">or</span>
                <hr className="" />
                <br />
              </div>
              <form onSubmit={formik.handleSubmit} className="space-y-4 ">
                {errorMsg && <span className="text-brand-red">{errorMsg}</span>}
                <div className="block md:flex gap-2 justify-center">
                  <div className="w-full my-2 md:w-[46%]">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formik.values.firstName}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      className="border-2 border-zinc w-full appearance-none bg-brand-black text-gray-900 sm:text-sm rounded-full focus:ring-brand-teal leading-tight focus:border-brand-teal focus:outline-none text-white block p-2.5"
                      placeholder="First name"
                    />

                    {formik.touched.firstName && formik.errors.firstName ? (
                      <span className="text-brand-red text-xs ml-2">
                        {formik.errors.firstName}
                      </span>
                    ) : null}
                  </div>
                  <div className="w-full my-2 md:w-[46%] p-0">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formik.values.lastName}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      className="border-2 w-full border-zinc appearance-none bg-brand-black text-gray-900 sm:text-sm rounded-full focus:ring-brand-teal leading-tight focus:border-brand-teal focus:outline-none text-white block p-2.5"
                      placeholder="Last name"
                    />
                    {formik.touched.lastName && formik.errors.lastName ? (
                      <span className="text-brand-red text-xs ml-2">
                        {formik.errors.lastName}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="block md:flex gap-2 justify-center">
                  <div className="w-full my-2 md:w-[46%] p-0">
                    <input
                      type="text"
                      name="userName"
                      id="userName"
                      value={formik.values.userName}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      className="border-2 w-full border-zinc appearance-none bg-brand-black text-gray-900 sm:text-sm rounded-full focus:ring-brand-teal leading-tight  focus:border-brand-teal focus:outline-none text-white block p-2.5"
                      placeholder="User name"
                    />
                    {formik.touched.userName && formik.errors.userName ? (
                      <span className="text-brand-red text-xs ml-2">
                        {formik.errors.userName}
                      </span>
                    ) : null}
                  </div>
                  <div className="w-full my-2 md:w-[46%] p-0">
                    <input
                      type="text"
                      name="email"
                      id="email"
                      value={formik.values.email}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      className="border-2 w-full border-zinc appearance-none bg-brand-black text-gray-900 sm:text-sm rounded-full focus:ring-brand-teal leading-tight  focus:border-brand-teal focus:outline-none text-white block p-2.5"
                      placeholder="Email"
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <span className="text-brand-red text-xs ml-2">
                        {formik.errors.email}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="my-2 relative flex mx-auto justify-center">
                  <div className="w-full md:w-[98%] mx-auto flex justify-center">
                    <div className="absolute text-white right-2 md:right-6 lg:right-6 inset-y-0 flex items-center">
                      {show ? (
                        <BsEyeFill onClick={() => toggle(false)} />
                      ) : (
                        <BsEyeSlashFill onClick={() => toggle(true)} />
                      )}
                    </div>
                    <input
                      type={show ? "text" : "password"}
                      name="password"
                      id="password"
                      value={formik.values.password}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      placeholder="Password"
                      className="bg-gray-50 border-2 border-zinc text-white sm:text-sm rounded-full focus:ring-brand-teal bg-brand-black focus:outline-none focus:border-brand-teal block w-full md:w-[95%] p-2.5 "
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <span className="text-brand-red text-xs ml-2">
                        {formik.errors.password}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex justify-center">
                  {loading ? (
                    <LoadingBtn loading={loading} />
                  ) : (
                    <button
                      type="submit"
                      className="w-full md:w-[95%] border-2 text-zinc border-white bg-white focus:outline-none focus:ring-brand-teal font-medium rounded-full text-sm px-5 py-2.5 text-center"
                    >
                      Sign Up
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
