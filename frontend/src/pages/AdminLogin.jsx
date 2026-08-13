import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext, isAdminUser } from "../AuthContext";
import logo from "../assets/logo.png";

/**
 * Admin-only sign-in page (/admin/login).
 * Authenticates against the regular backend /auth/login endpoint and then
 * verifies the account holds the admin role before granting access.
 */
export const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { signIn, logOut, isAdmin, isAuth } = useContext(AuthContext);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await signIn(values);
      const user = response.user || response.data?.user || response;

      if (isAdminUser(user)) {
        navigate("/admin");
      } else {
        // Logged in but not an admin — revoke the session and block access.
        await logOut();
        setErrorMsg(
          "This account does not have admin privileges. Please use an admin account."
        );
      }
    } catch (error) {
      console.error("Admin sign in failed", error);
      setErrorMsg(
        error?.message || "Invalid admin email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email address")
        .required("required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("required"),
    }),
    onSubmit: handleFormSubmit,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="BookBay logo" className="w-28 h-auto mb-4" />
          <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/90 text-[0.8rem] font-semibold tracking-wide uppercase">
              Admin Portal
            </span>
          </div>
          <h1 className="text-white text-[1.75rem] font-bold mt-4">Sign in to your dashboard</h1>
          <p className="text-slate-300 text-[0.9rem] mt-2 text-center">
            Authorized personnel only. This area is restricted to BookBay administrators.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
            {errorMsg && (
              <div
                className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-[0.85rem] text-red-700"
                role="alert"
              >
                <svg className="w-5 h-5 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errorMsg}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-[#111] text-[0.9rem] font-semibold"
              >
                Admin Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-4.5V12" />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 text-[0.9rem] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="admin@bookbay.com"
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <span className="text-red-500 text-xs mt-1 inline-block">{formik.errors.email}</span>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-[#111] text-[0.9rem] font-semibold"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 text-[0.9rem] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="••••••••••"
                />
              </div>
              {formik.touched.password && formik.errors.password ? (
                <span className="text-red-500 text-xs mt-1 inline-block">{formik.errors.password}</span>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 rounded-lg py-3 text-white font-semibold text-[0.95rem] transition-all duration-200 shadow-lg shadow-indigo-500/30 ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/50 active:scale-[0.99]"
              }`}
            >
              {loading && (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              {loading ? "Verifying credentials..." : "Sign in to Admin"}
            </button>

            {isAuth && !isAdmin && (
              <p className="text-[0.8rem] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                You are signed in as a regular user. Log out and sign in with an admin account.
              </p>
            )}
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-4">
            <p className="text-[0.75rem] font-semibold uppercase tracking-wide text-slate-500 mb-2">
              Demo admin credentials
            </p>
            <div className="flex items-center justify-between text-[0.85rem] text-slate-700 font-mono">
              <span>admin@bookbay.com</span>
              <span className="text-slate-400">/</span>
              <span>BookBay@2026</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-slate-300 hover:text-white text-[0.85rem] transition inline-flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to BookBay store
          </Link>
        </div>
      </div>
    </div>
  );
};
