import {Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useParams } from "react-router-dom";
import { LoadingBtn } from "../components/LoadingBtn";
import facebook from "../assets/facebook.svg"
import tiktok from "../assets/tiktok.svg"
import googleIcon from "../assets/google.svg"
import React from "react";
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
export const SignInPage = () => {
  const [loading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const facebook_provider = new FacebookAuthProvider()
  const [searchParams, setSearchParams] = useSearchParams();
  const { next } = Object.fromEntries(searchParams);
  const { title, author, cover, year } = useParams();
  // sign in existing user
  const SignInExistingUsers = async (values) => {
    setIsLoading(true);
    await signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        // ...
        // console.log("what's up");
        const user = userCredential.user;
        localStorage.setItem("isAuth", true);
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
        if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
          setErrorMsg("Invalid email or password");
          console.log(error, "hello")
        } else {
          setErrorMsg("An error occurred, try again!");
          console.log(error, "hello")
        }
      })
      .finally(() => {
        setIsLoading(false); // Set loading state to false after login process completes
      });
  };

  // handling form submitting
  const handleFormSubmit = (values) => {
    console.log("fuck")
    SignInExistingUsers(values);
    console.log("am here");
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

  const signInWithFacebook = () => {

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
  return (
    <div className="pt-10">
      <section className="flex items-center justify-center h-[100vh]">

        <div className="w-full max-w-sm px-6 py-8 m-auto mx-auto bg-[#fff] rounded-[0.5rem] sha">
          

      <div className="flex flex-col text-center leading-normal text-style text-[#000] justify-center mx-auto">
            <h2 className="outfit text-[1.5rem]  font-bold">Sign In</h2>
            <p className="text-[0.87rem]">To continue to Bookbay</p>
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


               
                  
                  <div className="w-full my-2 p-0">
                    <label  className="cursor-pointer text-[#000] text-[1rem] font-bold leading-normal capitalize" htmlFor="email">email:</label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      value={formik.values.email}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      placeholder="example@gmail.com"
                      className="w-full block rounded-[0.25rem] border-[1px] border-solid placeholder:text-[#666] text-[0.875rem] text-style font-normal lowercase h-[2rem] placeholder:pl-[0.5rem] leading-normal  border-[#333]"
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <span className="text-red-400 text-xs ml-3">
                        {formik.errors.email}
                      </span>
                    ) : null}
                  </div>

                
                  <div className="w-full my-2 p-0">
                  <label  className="cursor-pointer text-[#000] text-[1rem] font-bold leading-normal capitalize" htmlFor="password">Password:</label>

                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        placeholder="********"
                        className="w-full block rounded-[0.25rem] border-[1px] border-solid placeholder:text-[#666] text-[0.875rem] text-style font-normal lowercase h-[2rem] placeholder:pl-[0.5rem] leading-normal  border-[#333]"
                      />
                     
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
            or sign in with
        </span>

        <span className="w-[33%] border-b border-[#000]"></span>
    </div>

  <div className="flex flex-col gap-3">
  <button type="submit"  onClick={() => signInWithGoogle()} className="flex w-full justify-center items-center gap-3 border-[1px] border-solid border-[#000] rounded-[0.25rem]">

<img className="w-[1rem] h-[1rem]" width="1.5rem" height="1.5rem" src={googleIcon} alt="sign-up with google" />
<span className="text-[0.875rem] text-style font-normal leading-normal capitalize">continue with google</span>

</button>

    <button type="submit"  onClick={() => signInWithFacebook()} className="flex w-full justify-center items-center gap-3 border-[1px] border-solid border-[#000] rounded-[0.25rem]">

<img className="w-[1rem] h-[1rem]" width="1.5rem" height="1.5rem" src={facebook} alt="sign-up with google" />
<span className="text-[0.875rem] text-style font-normal leading-normal capitalize">continue with Facebook</span>
</button>
    <button type="submit" className="flex w-full justify-center items-center gap-3 border-[1px] border-solid border-[#000] rounded-[0.25rem]">

<img className="w-[1rem] h-[1rem]" width="1.5rem" height="1.5rem" src={tiktok} alt="sign-up with google" />
<span className="text-[0.875rem] text-style font-normal leading-normal capitalize">continue with Tiktok</span>
</button>
  </div>

  <div className=" capitalize mtp leading-normal font-normal text-[0.875rem] text-center">
                  <span>don't have an account?  </span>
                  <Link to="/sign-up" className="text-[#00f] underline">Sign In</Link>
                  </div>
  
              </form>
          </div>
      </section>
    </div>
  );
};
