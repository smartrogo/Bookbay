import React, { useContext, useState, useEffect, useRef } from "react";
import { Button } from "../components/Button";
import trash from "../assets/trash.svg";
import { Footer } from "../components/Footer";
import PaymentModal from "../components/PaymentModal";
import { useAtom } from "jotai";
import { LoadingBtn } from "../components/LoadingBtn";
import { cartItems, isLoadingCartItems } from "../store/cartAtoms";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { removeBookId } from "../store/actions/bookAction";
import { fetchCartItems, startPayment, removeCartItem } from "../services/bookService";

export const Cart = () => {
  const dispatch = useDispatch();
  const [selectedPriceType, setSelectedPriceType] = useState("priceBuy");
  const [buySelected, setBuySelected] = useState(true);
  const [borrowSelected, setBorrowSelected] = useState(false);
  const [price, setPrice] = useState(0);
  const { userData } = useContext(AuthContext);
  const [cartAtom, setCartAtom] = useAtom(cartItems);
  const [isLoadingCart, setIsLoadingCart] = useAtom(isLoadingCartItems);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef();
  const userId = useSelector((state) => state.userId);

  const currentUserId = userId || userData?.id || userData?.userId;

  const handleBuy = () => {
    setSelectedPriceType("priceBuy");
    setBuySelected(true);
    setBorrowSelected(false);
  };

  const handleBorrow = () => {
    setSelectedPriceType("priceBorrow");
    setBuySelected(false);
    setBorrowSelected(true);
  };

  useEffect(() => {
    const loadCart = async () => {
      if (!currentUserId) return;
      setIsLoadingCart(true);
      try {
        const cartItemsData = await fetchCartItems(currentUserId);
        setCartAtom(cartItemsData);
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setIsLoadingCart(false);
      }
    };

    loadCart();
  }, [currentUserId, setCartAtom, setIsLoadingCart]);

  const { showToast } = useToast();

  const handleShowPaymentModal = async () => {
    if (!currentUserId) {
      // redirect unauthenticated users to sign-in with return path
      navigate(`/sign-in?next=/cart`);
      return;
    }

    setShowPaymentModal(true);
    setLoading(true);
    const bookIds = cartAtom.map((item) => item.id);

    try {
      const paymentData = await startPayment(currentUserId, {
        bookIds,
        priceType: selectedPriceType,
      });
      const authorizationUrl = paymentData?.authorization_url || paymentData?.data?.authorization_url || paymentData;
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        console.error("Payment response missing authorization URL", paymentData);
      }
    } catch (error) {
      console.error("Error starting payment:", error);
      setShowPaymentModal(false);
      showToast("Failed to initiate payment. Please try again later.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleHidePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const deleteBookWithConfirmation = (id) => {
    setBookToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete || !currentUserId) return;

    setIsLoading(true);
    try {
      await removeCartItem(currentUserId, bookToDelete);
      dispatch(removeBookId(bookToDelete));
      const newCartItems = cartAtom.filter((item) => item.id !== bookToDelete);
      setCartAtom(newCartItems);
      setBookToDelete(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting cart item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect function to handle outside click to toggle
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        // Close "Manage Account" content here if needed
        setShowDeleteModal(false);
        setShowPaymentModal(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuRef]);

  const isCartEmpty = cartAtom.length === 0;

  console.log("Atom", cartAtom);
  useEffect(() => {
    const totalPrice = cartAtom.reduce((acc, item) => {
      const itemPrice = selectedPriceType === "priceBorrow" ? item.priceBorrow || 0 : item.priceBuy || 0;
      return acc + itemPrice;
    }, 0);
    setPrice(totalPrice);
  }, [cartAtom, selectedPriceType]);

  const CartItem = () => {
    return (
      <div className="bg-[#fff] py-[1rem] px-[0.5rem] md:py-[3.125rem] md:px-[5.4375rem] mx-auto flex flex-col gap-8">
        {cartAtom.map((item, index) => (
          <div
            key={index}
            className="box-content flex gap-10 bg-[#fff] rounded-[0.9375rem] shwd"
          >
            <div className="w-full p-2">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <div className="flex md:justify-center items-center">
                  <img
                    src={`${item.cover}`}
                    alt={item.title}
                    className="w-[5rem] h-[5.14288rem] object-scale-down"
                  />

                  <div className="text-[#1E1E1E]">
                    <span className="text  font-medium text-[1.125rem] text-style leading-normal">
                      {item.title}
                      {console.log("from cart", item)}
                    </span>
                    <p className="text-[0.75rem] font-normal leading-normal capitalize text-style">
                      Only for sale
                    </p>
                  </div>
                </div>

                <div className="flex md:justify-center items-center gap-6">
                  <Button
                    onClick={handleBuy}
                    value={buySelected ? "✓ Buy" : "Buy"}
                    // value={`Buy ${item.priceBuy}`}
                    cls_name={`text-[0.80rem] btn md:text-[1rem] font-medium ${
                      buySelected ? "bg-[#31AF31]" : "bg-[#DAA520]"
                    } rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem] ${
                      buySelected
                        ? "disabled:opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  />

                  <Button
                    onClick={handleBorrow}
                    value={borrowSelected ? "✓ Borrow" : "Borrow"}
                    // value={`Borrow ${item.priceBorrow}`}
                    cls_name={`text-[0.80rem] btn md:text-[1rem] font-medium ${
                      borrowSelected ? "bg-[#31AF31]" : "bg-[#DAA520]"
                    } rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem] ${
                      borrowSelected
                        ? "disabled:opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  />

                  <button onClick={() => deleteBookWithConfirmation(item.id)}>
                    <img src={trash} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end mt-4">
          <p className="text-[#1E1E1E] font-medium text-lg">
            Total: NGN {price} {/* Display total price */}
          </p>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-600 bg-opacity-50">
            <div
              ref={menuRef}
              className="modal-bg  w-[20rem] md:w-[40rem] bg-white p-6 md:p-10 rounded-md"
            >
              <div
                className="flex items-center p-3 mb-4 text-[0.8rem] text-red-800 rounded-[0.25rem] bg-red-50"
                role="alert"
              >
                <svg
                  className="flex-shrink-0 inline w-4 h-4 mr-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="text-red-400">
                    Are you sure you want to delete this book from your cart?
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <Button
                  value="Cancel"
                  onClick={() => setShowDeleteModal(false)}
                  cls_name="text-[0.80rem] btn hover:bg-gray-200 md:text-[1rem] font-medium bg-red-white rounded-[0.25rem] md:rounded-[0.3125rem] text-gray-500 py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"
                />

                {isLoading ? (
                  <LoadingBtn
                    loading={isLoading}
                    value="Deleting"
                    cls_name="text-[0.80rem] btn hover:bg-red-600 md:text-[1rem] font-medium bg-red-400 rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"
                  />
                ) : (
                  <Button
                    value="Delete"
                    onClick={confirmDelete}
                    cls_name="text-[0.80rem] btn hover:bg-red-600 md:text-[1rem] font-medium bg-red-500 rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  if (isLoadingCart)
    return (
      <div className="mt-[20rem] flex justify-center items-center">
        <ClipLoader
          loading={isLoadingCart}
          size={80}
          color="#00f"
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  return (
    <div
      style={{ paddingTop: isCartEmpty ? "8rem" : "5rem" }}
      className="h-screen"
    >
      <div className="w-[90%] mx-auto">
        <h1 className="text-[#000] capitalize font-bold test-style outfit md:text-[3rem] text-[1.5rem] leading-normal">
          cart management
        </h1>
        <p className="text-[#1E1E1E] text-[0.875rem] md:text-[1.25rem] text-style font-medium leading-normal">{`You have ${cartAtom.length} item in your cart`}</p>

        {isCartEmpty ? (
          <p>You haven&apos;t added anything to your cart!</p>
        ) : (
          <div className="w-full mx-auto bg-[#F5F5F5] rounded-[0.9375rem]">
            <CartItem />
          </div>
        )}
      </div>

      <div className="flex md:justify-center items-center gap-6">
        <img
          src="https://www.aqskill.com/wp-content/plugins/woo-paystack/assets/images/paystack-wc.png"
          alt="Paystack Logo"
          style={{ marginBottom: "5px", height: "70px", width: "270px" }}
        />
      </div>

      <div className="mt-14 flex justify-center items-center">
        {!isCartEmpty &&
          (loading ? (
            <LoadingBtn
              value="Checking Out.."
              loading={loading}
              cls_name="text-[1rem] font-bold btn md:text-[1rem] bg-[#2424ff] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[3rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"
            />
          ) : (
            <Button
              onClick={handleShowPaymentModal}
              value="Go to Checkout"
              cls_name="text-[0.80rem] btn md:text-[1rem] font-medium bg-[#31AF31] px-[5rem] py-[1.2rem] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[0.5rem]  poppins text-center text-style capitalize  text-center flex items-center leading-[1.23713rem] md:leading[0.62181rem]"
            />
          ))}
      </div>

      <PaymentModal
        menuRef={menuRef}
        show={showPaymentModal}
        handleClose={handleHidePaymentModal}
        message="checked out!"
      />

      <Footer />
    </div>
  );
};
