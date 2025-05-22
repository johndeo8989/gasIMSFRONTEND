import React from 'react'
import './Header.css'
import { HiOutlineMenu } from "react-icons/hi";
import Logo from '../../assets/headerlogo.png'
import { useLocation } from 'react-router-dom'
const Header = ({ toggleMenu, toggleMobileMenu }) => {

  const location = useLocation().pathname.slice(1).slice(1)


  return (
    <div className='header flex items-center justify-between pt-8 bg-red-400'>
      <div className="cont-1 flex items-center">
        <div className="menu-icon hidden lg:hidden expand-icon" onClick={toggleMenu}><HiOutlineMenu /></div>
        <div className="menu-icon mobile-menu" onClick={toggleMobileMenu}><HiOutlineMenu /></div>
        <h3 className=''>{useLocation().pathname.slice(1)[0].toUpperCase() + location.split('/')[0]}</h3>
      </div>
      <img src={Logo} alt="" />
    </div>
  )
}

export default Header