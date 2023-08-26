import React from "react";
import { Button } from "./Button";

export const Reasons = () => {
  return (
    <div className="text-[#fff] bg-[#DAA520] roboto text-style  capitalize leading-normal p-[2rem] md:p-[4.2rem]">
      <h1 className="text-center mb-2 text-[1.5rem]  font-bold md:text-[3rem]">
        Why use Bookbay ?
      </h1>

      <p className="text-[0.5rem] text-justify font-normal md:text-[1.25rem]">
        BookBay is your literary haven, offering an all-encompassing platform
        that empowers you to borrow, buy, sell, and indulge in reading
        adventures at remarkably affordable prices. Immerse yourself in a
        diverse collection of books spanning genres, from captivating mysteries
        to timeless classics. Whether you're seeking thrilling narratives or
        expanding your knowledge with non-fiction, BookBay has something for
        everyone. Dive into a world of choice without worrying about breaking
        the bank. BookBay's pricing structure ensures that your reading
        pleasures remain cost-effective, allowing you to explore new worlds and
        ideas without the constraints of traditional book costs. Experience the
        joy of discovering new authors and stories without the hefty price tags.
        Read anytime, anywhere – that's the magic of BookBay. Our user-friendly
        interface enables you to access your borrowed or purchased books on
        various devices, whether you're relaxing at home or on the go. Enjoy the
        convenience of carrying your entire library with you, ready to transport
        you to new dimensions whenever you choose. But BookBay isn't just about
        consuming content – it's about creating connections. Join a vibrant
        community of fellow book enthusiasts who share your passion. Engage in
        discussions, recommend hidden gems, and share your thoughts on your
        favorite reads. And if your bookshelves are overflowing, turn your
        collection into currency by selling on BookBay, connecting your books
        with new owners who'll cherish them. Your security and privacy are
        paramount to us. BookBay ensures that your transactions and personal
        data are safeguarded, giving you peace of mind as you embark on your
        literary journey. Discover a realm where stories come to life without
        financial barriers. Join BookBay today and unlock a world of literary
        wonders that fits your budget and fuels your imagination.
      </p>

      <div className="flex justify-center mt-8">
        <Button value="Join us today !" cls_name="bg-[#0F9D58] mx-auto rounded-[0.5rem] py-[0.56563rem] px-[1.09794rem] md:py-[1.0625rem] md:px-[2.0625rem] text-center" />
      </div>
    </div>
  );
};
