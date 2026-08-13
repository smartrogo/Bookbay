import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { verifyPayment as verifyPaymentService } from "../services/bookService";
import { Footer } from "../components/Footer";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";

const Discription = ({ title, body }) => {
  return (
    <div className="text-style text-start my-4 capitalize">
      <h2 className="text-[#00f] outfit text-[1.5rem] font-bold leading-normal ">
        {title}
      </h2>
      <p className="text-[#000] poppins text-[1rem] font-normal">{body}</p>
    </div>
  );
};

export const Success = () => {
  const { userData } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [ref, setRef] = useState("");
  const [response, setResponse] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reference = queryParams.get("reference");
    if (!reference) {
      navigate("/");
      return;
    }
    setRef(reference);
  }, [location.search, navigate]);

  useEffect(() => {
    const userId = userData?.id || userData?.userId;
    if (!ref || !userId) return;

    const verifyPayment = async () => {
      try {
        const payload = await verifyPaymentService(userId, ref);
        if (payload.status === "Success" || payload.success === true) {
          setResponse("Purchase successful");
        } else {
          setResponse("Purchase verification failed");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setResponse("Purchase verification failed");
      }
    };

    verifyPayment();
  }, [ref, userData]);

  return (
    <div className="mt-20 h-screen">
      <div className="p-4 w-[100%] md:w-[85%] mx-auto">
        <Discription title="Book Purchase Successfully" body="Go to my book" />
      </div>

      <Link
        to={`/my-books`}
        className="my-[2px] roboto font-normal leading-normal text-[0.775rem] md:text-[1.5rem] capitalize text-style text-[#31af31] flex gap-[0.2rem] md:w-[9rem] absolute right-4 w-[6rem] md:right-9 links items-center"
      >
        <span className="underline">My Books </span>
        <LiaLongArrowAltRightSolid className="w-[1.5rem] mt-1" />
      </Link>

      <Footer />
    </div>
  );
};
