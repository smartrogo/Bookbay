import React, { useState, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Button } from "../components/Button";
import { LoadingBtn } from "../components/LoadingBtn";
import { AuthContext } from "../AuthContext";

export const SignUpPage = () => {
  const [loading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "";
  const { signUp } = useContext(AuthContext);

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      await signUp(values);
      navigate(next || "/");
    } catch (error) {
      console.error("Sign up failed", error);
      if (error?.message?.includes("email")) {
        setErrorMsg("Email address is already in use. Please use a different email.");
      } else {
        setErrorMsg("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email address")
        .required("required"),
      phone: Yup.string().required("required"),
      password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    }),
    onSubmit: handleFormSubmit,
  });

  return (
    <div className="pt-20">
      <section className="flex items-center justify-center min-h-[100vh]">
        <div className="w-full max-w-sm px-6 py-8 m-auto bg-white rounded-[0.5rem] shadow-lg">
          <div className="flex flex-col text-center text-[#000] mb-6">
            <h2 className="text-[1.5rem] font-bold">Sign Up</h2>
            <p className="text-[0.87rem]">Create an account to access Bookbay.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="flex items-center p-3 mb-4 text-[0.8rem] text-red-800 rounded-[0.25rem] bg-red-50" role="alert">
                <span className="text-red-400">{errorMsg}</span>
              </div>
            )}

            <div className="w-full">
              <label htmlFor="email" className="block mb-2 text-[#000] text-[1rem] font-bold capitalize">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className="w-full rounded-[0.25rem] border border-[#333] px-2 py-2 text-[0.875rem]"
                placeholder="example@gmail.com"
              />
              {formik.touched.email && formik.errors.email ? (
                <span className="text-red-400 text-xs">{formik.errors.email}</span>
              ) : null}
            </div>

            <div className="w-full">
              <label htmlFor="phone" className="block mb-2 text-[#000] text-[1rem] font-bold capitalize">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formik.values.phone}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className="w-full rounded-[0.25rem] border border-[#333] px-2 py-2 text-[0.875rem]"
                placeholder="07023456784"
              />
              {formik.touched.phone && formik.errors.phone ? (
                <span className="text-red-400 text-xs">{formik.errors.phone}</span>
              ) : null}
            </div>

            <div className="w-full">
              <label htmlFor="password" className="block mb-2 text-[#000] text-[1rem] font-bold capitalize">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className="w-full rounded-[0.25rem] border border-[#333] px-2 py-2 text-[0.875rem]"
                placeholder="********"
              />
              {formik.touched.password && formik.errors.password ? (
                <span className="text-red-400 text-xs">{formik.errors.password}</span>
              ) : null}
            </div>

            <div>
              {loading ? (
                <LoadingBtn
                  loading={loading}
                  value="Creating account..."
                  cls_name="w-full text-white bg-[#6c6cfd] font-bold rounded-[0.25rem] py-2"
                />
              ) : (
                <Button
                  value="Create account"
                  type="submit"
                  cls_name="w-full text-[0.80rem] md:text-[1rem] bg-[#0000FF] rounded-[0.25rem] text-white py-2"
                />
              )}
            </div>

            <div className="text-center text-[0.875rem]">
              Already have an account?{' '}
              <Link to={`/sign-in${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-[#00f] underline">
                Log In
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
