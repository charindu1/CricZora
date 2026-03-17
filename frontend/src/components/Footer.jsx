import { Link } from 'react-router-dom'
import logo from '../assets/big_logo.png'
import light_phone from '../assets/light-phone.svg'
import light_gmail from '../assets/light-gmail.svg'
import light_whatsapp from '../assets/light-whatsapp.svg'
import light_facebook from '../assets/light-facebook.svg'
import light_linkedin from '../assets/light-linkedin.svg'
import light_instagram from '../assets/light-instagram.svg'
import light_github from '../assets/light-github.svg'
import './Footer.css'


export default function Footer() {
    return (
        <div className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <img src={logo} alt="big_logo" />
                    <p>Get data-driven win probability predictions for upcoming international matches, 
                        Powered by Machine Learning • T20 • ODI • Test</p>
                </div>
                <div className="footer-center">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/predict">Predict</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/model">Model</Link></li>
                    </ul>
                </div>
                <div className="footer-right">
                    <h2>Follow Me</h2>
                    <ul className="contact-info">
                        <li><img src={light_phone} alt="" className='phone'/>+94 71 553 1465</li>
                        <li><img src={light_gmail} alt="" className='gmail'/>charinduruhansa2003@gmail.com</li>
                        <li><img src={light_whatsapp} alt="" className='whatsapp'/>+94 71 553 1465</li>
                    </ul>
                    <div className="social-links">
                        <li className='linkedin' onClick={() => window.open('https://www.linkedin.com/in/charindu-munasinghe-545aa4273?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app')}>
                            <div className="contact-bg">
                                <img src={light_linkedin} alt="" />
                            </div>
                        </li>
                        <li className="github" onClick={() => window.open('https://github.com/charindu1')}>
                            <div className="contact-bg">
                                <img src={light_github} alt="" />
                            </div>
                        </li>
                        <li className='facebook' onClick={() => window.open('https://www.facebook.com/share/17vfyU6xrQ/')}>
                            <div className="contact-bg">
                                <img src={light_facebook} alt="" />
                            </div>
                        </li>
                        <li className='instagram' onClick={() => window.open('https://www.instagram.com/charindu_munasinghe?igsh=cm51dWdmMmFub3Vt')}>
                            <div className="contact-bg">
                                <img src={light_instagram} alt="" />
                            </div>
                        </li>
                    </div>
                </div>
            </div>
            <hr />
            <div className="copyright-text">
                <p>© 2026 CricZora. All Rights Reserved.</p>
            </div>
        </div>
    )
}