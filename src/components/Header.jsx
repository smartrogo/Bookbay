import React from 'react';
import { useState, useEffect } from 'react';
import {RxCross1} from 'react-icons/rx';
import {RiMenu3Line} from 'react-icons/ri';
// import { Button } from './Button';
import { Button } from './Button';
import { useRef } from 'react';
// import { NavLink } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { Login } from '../routes/Login';


export const Header2 = () => {
  const [active, setActive] = useState(false)

  const handleNavbar = () => {
    setActive(!active)
  }

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setActive(false)
      }
    }

    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  })

//   const navLinkStyle = ({ isActive }) => {
//     return {
//     textDecoration: isActive ? 'underline' : 'none',
//     textDecorationColor: isActive ? '#0F9D58': 'none',
//     textDecorationThickness: isActive ? '2px' : '0px'
//     }
//   }

//   const next = useNavigate()
  return (
    <div className='bg-[#484848] fixed px-2 border-2 border-red-600 sm:px-4 py-2.5 z-20 top-0 left-0 border-b shadow-md border-gray-500 w-full text-white flex '>

      <div className='container border-2 border-green-500 flex flex-wrap items-center justify-around mx-auto'>

       

        <div className=' items-center justify-between border-2 border-yellow-400'>

          <div className=' absolute right-8 top-[18px] items-center text-center mb-4 flex sm:hidden cursor-pointer scale-150 '>
            <RiMenu3Line onClick={ handleNavbar } style={{ color: 'white', textAlign: 'center'}}/>
          </div>

          {/* Desktop view */}
          <ul className='hidden sm:flex gap-8 p-4 w-full uppercase md:text-sm md:font-bold font-popins rounded-lg text-[#f5f5f5]'>
            <li className='hover:underline hover:decoration-[#0F9D58] hover:decoration-2 underline-offset-4'>
              {/* <NavLink  style={navLinkStyle} to='/'>Home</NavLink> */}
            </li>
            <li className='hover:underline hover:decoration-[#0F9D58] hover:decoration-2 underline-offset-4'>
              {/* <NavLink style={navLinkStyle} to='/about'>About</NavLink> */}
            </li>
            {/* <Button next={() => next('Login')} primaryGreen='#0f9d58' ml='5px' typeValue='Login'/> */}
          </ul>

          {/* Mobile view */}
          <div ref={menuRef} className={active ? 'cursor-pointer border-2 try flex flex-col items-start p-3 fixed inset-0 right-[30%] uppercase h-full bg-black/50 backdrop-blur-sm gap-5 transition delay-700 duration-300 ease-in-out sm:hidden' : 'hidden'}>
            <ul className='flex flex-col'>
              <RxCross1 onClick={handleNavbar} className='close mt-7 right-0 text-white font-medium text-[25px] leading-5 not-italic'/>
              <li className='hover:underline hover:decoration-[#0F9D58] underline-offset-8 text-white font-medium text-[16px] leading-5 not-italic'>
                {/* <NavLink style={navLinkStyle} to='/'>Home</NavLink> */}
              </li>
              <li className='hover:underline hover:decoration-[#0F9D58] hover:decoration-2 underline-offset-4 text-white font-medium text-[16px] leading-5 not-italic'>
                {/* <NavLink style={navLinkStyle} to='/about'>About</NavLink> */}
              </li>
            </ul>
            <div  className='flex justify-start'>
              <Button primaryGreen='#0f9d58'/>
            </div>
          </div>
          
        </div>

       <a href="" className='flex items-center'>
          <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'> Bookbay</span>
        </a>

      </div>
    </div>
  )
}
