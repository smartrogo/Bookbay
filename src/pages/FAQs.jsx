import React from 'react';
import Accordion from '../components/Accordion';
import { Footer } from '../components/Footer';

export const FAQs = () => {
  return (
    <div className='pt-20 h-screen relative'>
      <div className='capitalize text-[#000] text-style  leading-normal w-[90%] mx-auto'>
       <h1 className='text-[1.5rem] md:text-[3rem] font-bold'>Frequently ask questions (FAQS)</h1>
       <p className='text-[0.875rem] font-normal md:text-[1.25rem]'>may be we can answer you questions here.</p>


   <div className='mt-10'>
   <Accordion
     question="What is Bookbay?"
     answer="Answer: Bookbay is a decentralized social networking platform designed to encourage the reading culture in Africa by addressing the challenges associated with textbook borrowing, buying, and selling. It uses a new peer-to-peer protocol to change access to educational resources for students, researchers, and individuals alike."
    />
    <Accordion
     question="How does Bookbay work?"
     answer="Answer: Bookbay is a peer-to-peer platform, which means that users can directly connect with each other to borrow, buy, and sell textbooks."
    />
    <Accordion
     question="Why use Bookbay ?"
     answer="Answer:
     Read to Earn:This is a compelling concept where you can be rewarded for your reading activities. By offering incentives such as tokens, and discounts.
     Borrow: Access a vast library of books, including rare and hard-to-find titles, through our borrowing service, saving you money and space.
    ·Buy: Shop for both new and used books at budget-friendly prices, making it easy to expand your personal collection.
    ·Sell: Earn money by selling your own books and research papers, turning your bookshelf/research into a potential source of income.
    ·Audiobooks: Immerse yourself in listening adventures, discover new genres, and enjoy a diverse range of titles, all conveniently accessible.
    ·Secure Transaction:Bookbay prioritizes secure transactions to ensure the safety of your financial information and personal data."
    />
    <Accordion
     question="Who can use Bookbay?"
     answer="Answer: Bookbay is free to use. Users only pay for the textbooks they borrow or buy from other users.."
    />
    <Accordion
     question="What are the benefits of using Bookbay?"
     answer="Answer: Bookbay offers a number of benefits to users, including:
     Affordability: Bookbay is a more affordable way to access textbooks than traditional methods such as buying them from bookstores or renting them from libraries.
     Convenience: Peer-to-peer protocols allow users to complete transactions quickly and easily without the need for a central server.
     Security: Peer-to-peer protocols are more secure than traditional systems because they are not reliant on a central server.
     Community: Bookbay is a community of lifelong learners who are passionate about education and reading. Users can connect with each other to share knowledge, learn from each other, and build relationships."
    />
    <Accordion
     question="How do I get started with Bookbay?"
     answer="Answer:To get started with Bookbay, visit the website www.bookbay.com.ng and create an account. Once you have created an account, you can add the textbooks that are available or the textbooks you need. You can then browse other users' profiles to find textbooks that match your needs. Once you find a textbook you want, you can contact the owner directly to negotiate a price or borrow the textbook for free."
    />
    <Accordion
     question="What are the long-term goals of Bookbay?"
     answer="Answer: The long-term goal of Bookbay is to revolutionize African education and enhance reading culture by providing affordable access."
    />
    <Accordion
     question="How does Bookbay ensure that the textbooks being bought and sold are authentic?"
     answer="Answer: Bookbay is developing a number of features to ensure that the textbooks being bought and sold are authentic. These features include:
     A watermark system that will be embedded in all textbooks sold on the platform.
     A database of all textbooks that have been sold on the platform, will allow users to check if a textbook has been reported as stolen or counterfeit.
     A team of moderators will review all textbooks before they are listed on the platform."
    />
    <Accordion
     question="I have other questions about Bookbay. How can I get help?"
     answer="Answer: If you have other questions about Bookbay, you can contact the Bookbay team by email at info@bookbay.com.ng or +2348120304001. You can also find more information on the Bookbay website."
    />

   </div>


      </div>

<Footer />
    </div>
  )
}
