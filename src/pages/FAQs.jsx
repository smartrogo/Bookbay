import React from 'react';
import Accordion from '../components/Accordion';
import { Footer } from '../components/Footer';

export const FAQs = () => {
  return (
    <div className='pt-20 h-screen'>
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
   </div>


      </div>

<Footer />
    </div>
  )
}
