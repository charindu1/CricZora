import './About.css'
import { motion } from "framer-motion";
import overview from '../assets/overview.png'
import project_implementation from '../assets/project_implementation.png'
import motivation from '../assets/motivation.png'
import contact_us from '../assets/contact_us.png'
import { useEffect } from 'react';

export default function About({ enableDelay }) {

    // show in browser tab which page is this
    useEffect(() => {
        document.title = "CricZora - About";

        return () => {
        document.title = "CricZora - Home"; // optional reset when leaving page
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: enableDelay ? 0.4 : 0 }}
        >
            <div className="about container">
                <h1 className='main-title'>About The Project</h1>
                <div className="about-contents">
                    <div className="about-content">
                        <img src={overview} alt="" />
                        <div className="text-content">
                            <h2>Project Overview</h2>
                            <p>This website allows cricket enthusiasts to get data-driven predictions for the winning probabilities of upcoming international cricket matches across T20I, ODI, and Test cricket. There are seperate models for each formats, and users select a format, input details about the competing teams, venue, and toss winner and receive an estimated win probability for each team before match is begin.</p>
                        </div>
                    </div>
                    <div className="about-content reverse">
                        <img src={project_implementation} alt="" />
                        <div className="text-content">
                            <h2>Project Implementation</h2>
                            <p>This entire project with the machine learning models and the full web application was solely developed by <strong><span>Mr. Charindu Munasinghe</span></strong>, a passionate full-stack developer and machine learning enthusiast with a deep love for cricket. As a personal portfolio project, it showcases end-to-end skills in data science, backend development, and modern frontend technologies.</p>
                        </div>
                    </div>
                    <div className="about-content">
                        <img src={motivation} alt="" />
                        <div className="text-content">
                            <h2>Motivation</h2>
                            <p>Cricket is more than just a game, also it's a passion shared by millions. I wanted to explore how machine learning can add an analytical mechanism to the excitement of predicting match outcomes. This project demonstrates real-world application of ML in sports analytics while serving as a showcase of my ability to build complete, user-friendly applications from scratch.</p>
                            <p> <span><strong>Note:</strong></span> Predictions are probabilistic and for entertainment purposes only. Actual match results depend on many unpredictable factors like player performance on the day, weather, and strategy.</p>
                        </div>
                    </div>
                    <div className="about-content reverse">
                        <img src={contact_us} alt="" />
                        <div className="text-content">
                            <h2>Contact Me</h2>
                            <p> Interested in collaborating, hiring, or just chatting about cricket/ML? Reach out via <span>charinduruhansa2003@gmail.com</span> or connect on LinkedIn, Facebook, and Instergram.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}