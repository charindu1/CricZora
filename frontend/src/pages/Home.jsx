// Home.jsx
import { useNavigate } from "react-router-dom";
import './Home.css';
import big_logo from '../assets/big_logo.png';
import light_forward_arrow from '../assets/light-forward-arrow.svg';
import result from '../assets/result.svg';
import bar_graph from '../assets/bar_graph.svg';
import home_ground from '../assets/home_ground.svg';
import { motion } from "framer-motion";
import usePageTitle from "../Hook/usePageTitle";

export default function Home({ enableDelay }) {
    const navigate = useNavigate();

    usePageTitle("CricZora - Home");

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: enableDelay ? 0.4 : 0 }}
        >
            <div className="home container">
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="hero-left">
                        <h1>
                            Welcome To<br /><span>CricZora</span>
                        </h1>
                        <p>
                            Get data-driven win probability predictions for upcoming international cricket matches, 
                            powered by Machine Learning models across T20, ODI, and Test formats.
                        </p>
                        <button 
                            className="btn-zora btn-home"
                            onClick={() => navigate('/predict')}
                        >
                            <div className="btn-content">
                                Start Prediction Now
                                <img src={light_forward_arrow} alt="Forward Arrow" />
                            </div>
                        </button>
                    </div>
                    <div className="hero-right">
                        <img 
                            src={big_logo}
                            alt="Cricket Illustration" 
                        />
                    </div>
                </div>

                {/* Features Preview */}
                <div className="feature-section">
                    <h2 className="feature-title"> Why Choose CricZora? </h2>
                    <div className="feature-items">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <img src={bar_graph} alt="" />
                            </div>
                            <h4>Accurate ML Models</h4>
                            <p>Trained on years of historical international cricket data</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <img src={home_ground} alt="" />
                            </div>
                            <h4>Venue & Toss Factors</h4>
                            <p>Considers home advantage, pitch conditions, and toss outcome</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <img src={result} alt="" />
                            </div>
                            <h4>Instant Results</h4>
                            <p>Real-time probability calculations before the match begins</p>
                        </div>
                    </div>
                </div>
                
            </div>
        </motion.div>
    );
}