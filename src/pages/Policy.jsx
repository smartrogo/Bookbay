import React from "react";
import { Footer } from "../components/Footer";

export const Policy = () => {
  return (
    <div className="mt-24 h-screen text-start">
     

      <div className="mt-4 p-4 w-full mx-auto md:w-[90%]">

      <h1 className="text-[#000] mb-2 outfit text-[1.5rem] text-style md:text-[2.25rem] font-bold leading-normal">
        Bookbay’s privacy policy{" "}
      </h1>

        <h2 className="outfit text-[#00f] text-[1.125rem] md:text-[1.5rem] font-bold text-style">
          Privacy Policy
        </h2>

        <p>
          <span className=" italic">Last Updated: 17/09/2023</span> <br/> At Bookbay App we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, services, or interact with us.
        </p>

        <div>
          <p className="">Information We Collect</p>
          <ul className=" list-decimal list-inside my-2">
            <li className="mb-4">
              <span className="font-bold text-[1rem] md:text-[1.2rem]">Personal Information:</span> We may collect personal information such as
              your name, email address, shipping address, and payment details
              when you make a purchase.
            </li>
            <li className="mb-4">
              <span className="font-bold text-[1rem] md:text-[1.2rem]">purchase. Browsing Information:</span> We collect non-personal
              information, including your IP address, browser type, and browsing
              behavior on our website.
            </li>
            <li><span className="font-bold text-[1rem] md:text-[1.2rem]">Communication:</span> We may record and store communication, including emails and customer support inquiries.</li>
          </ul>
        </div>

        <div className="mt-4">
          <p className="outfit text-[#00f] text-[1.125rem] md:text-[1.5rem] font-bold text-style">How We Use Your Information:</p>
          <ul className="list-decimal list-inside">
            <li className="mb-4"><span className="font-bold text-[1rem] md:text-[1.2rem]">Order Processing:</span> We use your personal information to process orders, provide customer support, and deliver products to you.</li>
            <li className="mb-4"><span className="font-bold text-[1rem] md:text-[1.2rem]">Personalization:</span> We use browsing information to personalize your experience, show relevant products, and improve our website.</li>
            <li className="mb-4"><span className="font-bold text-[1rem] md:text-[1.2rem]">Communication:</span> We may use your contact information to send order updates, promotional materials, and newsletters. You can opt out of marketing communications at any time.</li>
          </ul>
        </div>

        <div>
        <div className="mb-4">
        <p>
          <span className="font-bold text-[1rem] md:text-[1.2rem]">sharing Your Information:</span>
We do not sell or rent your personal information to third parties. However, we may share your information with:
</p>
<ul className=" list-decimal list-inside">
  <li>Shipping and delivery partners.</li>
  <li> Legal requirements, such as law enforcement agencies.</li>
  <li>· Payment processors for transaction processing.</li>
</ul>
        </div>
<p>
<span className="font-bold text-[1rem] md:text-[1.2rem]">Data Security:</span>
We employ industry-standard security measures to protect your data. However, no online transmission is entirely secure, and we cannot guarantee the security of your information.
Cookies:
We use cookies and similar technologies to enhance your browsing experience and collect non-personal information. You can control cookies through your browser settings.
Your Rights:
You have the right to access, update, and correct your personal information. You can also request the deletion of your data, subject to legal limitations.
Children's Privacy:
Our services are not intended for individuals under 13 years old. We do not knowingly collect or store information from children.
Changes to This Policy:
We may update this Privacy Policy periodically. Please review the policy regularly for any changes.
Contact Us:
If you have questions or concerns about your privacy or this policy, please contact us at +2348120304001 or <span className="underline">info@bookbay.com.ng  </span>
 By using our website and services, you consent to the practices described in this Privacy Policy.
          </p>
        </div>
      </div>

<Footer />
    </div>
  );
};
