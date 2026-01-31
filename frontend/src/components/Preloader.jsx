import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png'; 
import './Preloader.css';

export default function Preloader({ onComplete }) {
  
  useEffect(() => {
    // Simulate loading time (or wait for window load)
    const timer = setTimeout(() => {
        onComplete();
    }, 1000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="preloader-container">
        {/* The background that fades out */}
        <motion.div 
            className="preloader-bg"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }} 
        />
        
        {/* The Logo that moves */}
        <div className="logo-wrapper">
            <motion.img 
                src={logo} 
                alt="Loading..."
                layoutId="site-logo" // SAME ID as Navbar
                initial={{ x: -100, y: -10, opacity: 0 }}
                animate={{ x: 0, y: -10, opacity: 1 }} // Pulse or start big
                transition={{ duration: 0.8, ease: "circOut" }}
                className="preloader-logo"
            />
        </div>
    </div>
  );
}