import React, { useState } from 'react'
import './Layout.css'
import { Outlet } from "react-router-dom";
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import { IoMdClose } from "react-icons/io";


const Layout = () => {
  const [isExpand, setIsExpand] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsExpand(!isExpand)
  }
  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  }
  return (
    <div className='layout'>
      <div className="mobile-sidebar" style={{ left: isOpen ? "0" : "" }}>
        <div className="close" onClick={toggleMobileMenu}><IoMdClose /></div>
        <Sidebar isExpand={isExpand} onLinkClick={() => setIsOpen(false)} />
      </div>
      <Header toggleMenu={toggleMenu} toggleMobileMenu={toggleMobileMenu} />
      <div className="page-body">
        <Sidebar isExpand={isExpand} />
        <div className="main">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout