import google from "../assets/audio.svg";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BsEyeSlashFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LoadingBtn } from "../components/LoadingBtn";
import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useSearchParams } from "react-router-dom";

export const SignInPage = () => {
  const [show, setShow] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const [searchParams, setSearchParams] = useSearchParams();
  const { next } = Object.fromEntries(searchParams);

  useEffect(() => {
    // console.log("show", show);
  });
  const toggle = (bool) => {
    // console.log("boolin", bool);
    setShow(bool);
  };

  // sign in existing user
  const SignInExistingUsers = async (values) => {
    setIsLoading(true);
    await signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        // ...
        // console.log("what's up");
        const user = userCredential.user;
        console.log(user, "loged in");
        console.log("next:", next);
        if (next) {
          console.log("next:", next);
          navigate(next);
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          setErrorMsg("Invalid email or password");
          setErrorMsg("Invalid email or password");
          console.log(error.code);
        } else {
          setErrorMsg("An error occurred, try again!");
        }
      })
      .finally(() => {
        setIsLoading(false); // Set loading state to false after login process completes
      });
  };

  // handling form submitting
  const handleFormSubmit = (values, { resetForm }) => {
    SignInExistingUsers(values);
    console.log("am here");
    // resetForm();
  };

  // formik object
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    // yup validation schema
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          "Invalid email address"
        )
        .required("required"),
      // MyP@ssw0rd!
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]+$/,
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
        ),
    }),
    // submit function call
    onSubmit: handleFormSubmit,
  });
  const signInWithGoogle = () => {
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
  return (
    <div>
      <section className="mt-[5rem] overflow-y-hidden">
        <div className="flex flex-col items-center mt-[5rem] mb-[2rem] lg:mt-[3rem] md:mt-[2.5rem] px-4 md:px-6 py-8 mx-auto lg:py-0">
          <div className="w-full rounded-lg shadow border-[1px] border-zinc md:mt-0 sm:max-w-[30rem] xl:p-0">
            <div className="p-3 md:p-6 space-y-4 sm:p-4">
              <div className="login-section ">
                <h1 className="text-4xl md:text-5xl center my-4 text-white">
                  Log in
                </h1>
                <p className="center text-white">
                  Dont have an account{" "}
                  <NavLink
                    to="/accounts/signup"
                    className="underline text-brand-teal"
                  >
                    Sign up
                  </NavLink>
                </p>
                <button
                  to="#"
                  onClick={() => signInWithGoogle()}
                  className="rounded-full bg-white  hover:bg-opacity-30 
          shadow-md hover:shadow-lg px-4 py-2 text-zinc 
          font-medium my-4 flex justify-around w-60 items-center"
                >
                  <img src={google} alt="google" className="w-8" />
                  Log in with Google
                </button>{" "}
              </div>
              <div className="or text-center text-white">
                <hr />
                <span className="center">or</span>
                <hr className="" />
                <br />
              </div>
              <form onSubmit={formik.handleSubmit} className="space-y-4 ">
                {errorMsg && (
                  <div
                    className="px-4 py-2 mb-4 text-sm rounded-lg w-[90%] mx-auto bg-gray text-brand-red"
                    role="alert"
                  >
                    <span className="font-medium">{errorMsg}</span>
                  </div>
                )}

                <div className="my-2 flex justify-center">
                  <div className="w-full md:w-[95%]">
                    <input
                      type="text"
                      name="email"
                      id="email"
                      value={formik.values.email}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      placeholder="Email"
                      className="bg-gray-50 border-2 border-zinc text-white sm:text-sm rounded-full focus:ring-brand-teal bg-brand-black focus:outline-none focus:border-brand-teal block mx-auto w-full md:w-[95%] p-2.5"
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <span className="text-brand-red text-xs ml-3">
                        {formik.errors.email}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="my-2 relative flex justify-center items-center">
                  <div className="w-full md:w-[95%] mx-auto">
                    <div>
                      <div className="absolute text-white right-2 md:right-8 inset-y-0 flex items-center">
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
                        className="bg-gray-50 border-2 border-zinc text-white sm:text-sm rounded-l-full focus:ring-brand-teal bg-brand-black focus:outline-none focus:border-brand-teal block w-[92%] md:w-[90%] p-2.5 "
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <span className="text-brand-red text-xs ml-3">
                          {formik.errors.password}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mx-auto flex w-full md:w-[95%] justify-center">
                  {loading ? (
                    <LoadingBtn loading={loading} />
                  ) : (
                    <button
                      type="submit"
                      className="w-full md:w-[95%] border-2 text-zinc border-white bg-white focus:outline-none focus:ring-brand-teal font-medium rounded-full text-sm px-5 py-2.5 text-center"
                    >
                      Log in
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
