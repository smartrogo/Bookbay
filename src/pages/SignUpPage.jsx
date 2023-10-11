import React from "react";
import { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { LoadingBtn } from "../components/LoadingBtn";
import facebook from "../assets/facebook.svg"
import tiktok from "../assets/tiktok.svg"
import googleIcon from "../assets/google.svg"
export const SignUpPage = () => {
  const [loading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const facebook_provider = new FacebookAuthProvider();



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

  const signUpWithFacebook = () => {

signInWithPopup(auth, facebook_provider)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

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
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });
  }

  // handling form submition and clearing inputs
  const handleFormSubmit = (values) => {
    // creating new user
    signUp(values);

    // form reset
    // resetForm();
  };

  // formik object
  const formik = useFormik({
    initialValues: {
      email: "",
      phone: "",
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
      phone: Yup.number()
        .required("required"),

      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required")
    }),
    // submittion
    onSubmit: handleFormSubmit,
  });

  // Abcd123!
  return (
    <div className="pt-20">
      <section className="flex items-center justify-center h-[100vh]">

        <div className="w-full max-w-sm px-6 py-8 m-auto mx-auto bg-[#fff] rounded-[0.5rem] sha">
          
          <div className="flex flex-col text-center leading-normal text-style text-[#000] justify-center mx-auto">
            <h2 className="outfit text-[1.5rem]  font-bold">Sign Up</h2>
            <p className="text-[0.87rem]">To continue to Bookbay</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4 ">
            {errorMsg && <span className="text-red-400">{errorMsg}</span>}

            <div className="w-full my-2 p-0">
              <label
                htmlFor="email"
                className="cursor-pointer text-[#000] text-[1rem] font-bold leading-normal capitalize"
              >
                email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className="w-full block rounded-[0.25rem] border-[1px] border-solid placeholder:text-[#666] text-[0.875rem] text-style font-normal lowercase h-[2rem] placeholder:pl-[0.5rem] leading-normal  border-[#333]"
                placeholder="example@gmail.com"
              />
              {formik.touched.email && formik.errors.email ? (
                <span className="text-red-400 text-xs ml-2">
                  {formik.errors.email}
                </span>
              ) : null}
            </div>
            <div className="w-full my-2 p-0">
              <label
                htmlFor="phone"
                className="cursor-pointer text-[#000] text-[1rem] font-bold leading-normal capitalize"
              >
                Phone Number
              </label>
              <input
                type="number"
                name="phone"
                id="phone"
                value={formik.values.phone}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className="w-full block rounded-[0.25rem] border-[1px] border-solid placeholder:text-[#666] text-[0.875rem] text-style font-normal lowercase h-[2rem] placeholder:pl-[0.5rem] leading-normal  border-[#333]"
                placeholder="07023456784"
              />
              {formik.touched.phone && formik.errors.phone ? (
                <span className="text-red-400 text-xs ml-2">
                  {formik.errors.phone}
                </span>
              ) : null}
            </div>

            <div className="w-full my-2 p-0">
              <label
                htmlFor="password"
                className="cursor-pointer text-[#000] text-[1rem] font-bold leading-normal capitalize"
              >
                Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                placeholder="***********"
                className="w-full block rounded-[0.25rem] border-[1px] border-solid placeholder:text-[#666] text-[0.875rem] text-style font-normal lowercase h-[2rem] placeholder:pl-[0.5rem] leading-normal  border-[#333]"
              />
              {formik.touched.password && formik.errors.password ? (
                <span className="text-red-400 text-xs ml-2">
                  {formik.errors.password}
                </span>
              ) : null}
            </div>

            <div className="">
              {loading ? <LoadingBtn  loading={loading}/> : <Button
                value="Create"
                type="submit"
                cls_name="text-[0.80rem] w-full md:text-[1rem] bg-[#0000FF] rounded-[0.25rem] text-[#FFFFFF] py-[0.4375rem] px-[2rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center px-4 leading-[1.23713rem]"
              />}

                  
            </div>

            <div className="flex gap-3 justify-center items-center mt-4">
        <span className="w-[33%] border-b border-[#000]"></span>

        <span className="text-center text-[0.75rem] text-[#000] lowercase">
            or sign up with
        </span>

        <span className="w-[33%] border-b border-[#000]"></span>
    </div>

    <button type="submit"  onClick={() => signUpWithGoogle()} className="flex w-full justify-center items-center gap-3 border-[1px] border-solid border-[#000] rounded-[0.25rem]">

        <img className="w-[1rem] h-[1rem]" width="1.5rem" height="1.5rem" src={googleIcon} alt="sign-up with google" />
        <span className="text-[0.875rem] text-style font-normal leading-normal capitalize">continue with google</span>

    </button>
    
    <button type="submit" onClick={() => signUpWithFacebook()} className="flex w-full rounded-[0.25rem] border-[1px] border-solid border-[#000] justify-center items-center gap-3">
        <img className="w-[1rem] h-[1rem]" width="1.5rem" height="1.5rem" src={facebook} alt="sign-up with google" />
        <span className="text-[0.875rem] text-style font-normal leading-normal capitalize">continue with google</span>
    </button>
    <button className="flex w-full border-[1px] border-solid border-[#000] rounded-[0.25rem] justify-center items-center gap-3">
        <img className="w-[1rem] h-[1rem]" width="1.5rem" height="1.5rem" src={tiktok} alt="sign-up with google" />
        <span className="text-[0.875rem] text-style font-normal leading-normal capitalize">continue with google</span>
    </button>
                  <div className=" capitalize mtp leading-normal font-normal text-[0.875rem] text-center">
                  <span>already have an accound  </span>
                  <Link to="/sign-in" className="text-[#00f] underline">Log In</Link>
                  </div>
          </form>
        </div>
      </section>
    </div>
  );
};
