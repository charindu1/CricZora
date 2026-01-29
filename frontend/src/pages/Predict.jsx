import { useNavigate } from "react-router-dom";
import './Predict.css'
import { useEffect } from "react";
import { motion } from "framer-motion";
import light_forward_arrow from '../assets/light-forward-arrow.svg';

export default function Predict({ enableDelay }) {
    const navigate = useNavigate();

    // show in browser tab which page is this
    useEffect(() => {
        document.title = "CricZora - Predict";

        return () => {
        document.title = "CricZora - Home"; // optional reset when leaving page
        };
    }, []);

    const formats = [
        {id: "t20", label: "T20", description: "Twenty20 International", color: "#ffb703"},
        {id: "odi", label: "ODI", description: "One Day International", color: "#ff8a00"},
        {id: "test", label: "TEST", description: "Test Cricket International", color: "#ff3d00"}
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: enableDelay ? 0.4 : 0 }}
        >
            <div className="predict container">
                <div className="predict-section">
                    <h1 className="main-title"> International Cricket Winning Predictor </h1>
                    <p className="subtitle">Select a match format to start prediction...</p>

                    <div className="cards-container">
                        {formats.map((format) => (
                            <div
                                key={format.id} 
                                className="format-card"
                                onClick={() => navigate(`/predict/${format.id}`)}
                                style={{
                                        "--card-color": format.color,
                                        borderTop: `5px solid ${format.color}`
                                    }}
                            >
                            <h2>{format.label}</h2>
                            <p>{format.description}</p>
                            <span className="arrow-icon btn-content">
                                <img src={light_forward_arrow} alt="" />
                            </span> 
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}