import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'
import light_hamburger from '../assets/light-hamburger.svg';
import { motion } from "framer-motion";

export default function Navbar() {

  // track whether the page has been scrolled past a certain point
  // this used to change the navbar style(background, shadow)
  const [scrolled, setScrolled] = useState(false)
  // controll the visiblity of the mobile navigation menu
  const [mobileMenu, setMobileMenu] = useState(false)
  // state to track overlay closing animation
  const [isClosing, setIsClosing] = useState(false);


  // handler to detect window scroll position
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;

      // set scrolled to true "setScroll" when scroll exeeds 50px
      setScrolled(offset > 50);
    }
    // attach scroll event listner
    window.addEventListener('scroll', handleScroll)
    // remove event listner on component unmount
    return () => window.removeEventListener('scroll', handleScroll)
  }, []);

  // toggle mobile menu open/close state
  const toggleMenu = () => {
    if (mobileMenu) {
      // start closing animation
      setIsClosing(true);
      // after animation ends, close the menu
      setTimeout(() => {
        setMobileMenu(false);
        setIsClosing(false);
      }, 250);
    } else {
      setMobileMenu(true);
    }
  }

  // this ref used to close mobile navber after clicked outside
  const navbarRef = useRef(null)

  // close mobile menu when user clicks outside the navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenu && 
        navbarRef.current && 
        !navbarRef.current.contains(event.target)
      ) {
        setMobileMenu(false)
      }
    }

    // listen for mouse clicks on the entire document
    document.addEventListener('mousedown', handleClickOutside)

    // remove listener when menu state change or component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenu])

  // delay navigation to allow framer motion
  // navigate function from react-router-dom
  const navigate = useNavigate();
  const handleNavClick = (path) => {
    setMobileMenu(false); 

    setTimeout(() => {
      navigate(path);
    }, 250);
  };

  // to check which nav link is active
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
       {/* dark overlay shown only when mobile menu is open,
       clicking it close the mobile menu */}
      {mobileMenu && <div className={`overlay ${isClosing ? 'closing' : ''}`} onClick={toggleMenu}></div>}
      
      <div className={`navbar container ${scrolled ? 'scrolled' : ''}`} ref={navbarRef}>

        {/* logo section */}
        <div className="navbar-logo">
          <Link to="/">
            <motion.img 
              src={logo} 
              alt="logo" 
              layoutId="site-logo" // This ID connects it to the preloader
              transition={{ duration: 0.6, ease: [0.6, 0.01, -0.05, 0.9] }}
            />
          </Link>

          
        </div>
        {/* navigation menu */}
        <div className={`navbar-panel ${mobileMenu ? 'mobile-active' : ''}`}>
          <div className="navbar-menu">
            <ul>
              <li><span onClick={()=>handleNavClick("/")} className={isActive("/") ? 'active' : ''}>Home</span></li>
              <li><span onClick={()=>handleNavClick("/predict")} className={isActive("/predict") ? 'active' : ''}>Predict</span></li>
              <li><span onClick={()=>handleNavClick("/about")} className={isActive("/about") ? 'active' : ''}>About</span></li>
              <li><span onClick={()=>handleNavClick("/model")} className={isActive("/model") ? 'active' : ''}>Model</span></li>
            </ul>
          </div>
          <div className="navbar-action">
              <ul>
                <li><button className='btn-zora'>View on GitHub</button></li>
              </ul>
          </div>
        </div>
        <img src={light_hamburger} className='hamburger-icon' alt="menu" onClick={toggleMenu}/>
      </div>
    </>
  )
}