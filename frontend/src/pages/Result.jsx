import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"
import html2canvas from "html2canvas"
import './Result.css'
import '../App.css'
import light_share from '../assets/light-share.svg'
import light_download from '../assets/light-download.svg'
import light_cross from '../assets/light-cross.svg'
import { motion } from "framer-motion";
import logo from '../assets/logo.png'

export default function Result() {
    // allows to grab the state, it means "navigate("/result", { state: { data } })" here
    const location = useLocation();
    // programmatic navigation
    const navigate = useNavigate();

    // "location state" contains -> passed previous page data
    // "?." ensure -> no crash if state undefined
    // initialize prediction data from state
    const data = location.state?.data;
    // initialize venue info from state
    const venue = location.state?.venue;
    // initialize toss winner info from state
    const toss_winner = location.state?.toss_winner;
    // grab formatId from URL for title
    const formatId = location.pathname.split("/")[2];

    // used to capture preview image (Ref)
    const previewRef = useRef(null);

    // controll visibility of share popup
    const [showShare, setShowShare] = useState(false);
    // stores generated image file
    const [generatedFile, setGeneratedFile] = useState(null);
    // stores url for image preview in popup
    const [previewUrl, setPreviewUrl] = useState(null);
    // shows loading while image is being prepared
    const [isPreparing, setIsPreparing] = useState(false);
    // used for CSS close animation
    const [isClosing, setIsClosing] = useState(false);

    // safty redirect if user opens url directly
    useEffect(() => {
        if (!data) navigate("/", { replace: true });
    }, [data, navigate]);

    if (!data) return null; 

    // show in browser tab which page is this
    usePageTitle(`CricZora - ${formatId.toUpperCase()} Match Predicted Result`);

    // extract and formatting data
    // "??" --> ensure undefined values default to 0
    const team1Name = data.labels?.[0] || "Team 1";
    const team2Name = data.labels?.[1] || "Team 2";

    const probs = data.probabilities || {};
    const team1 = probs["1"] ?? 0; // team1 winning (%)
    const team2 = probs["0"] ?? 0; // team2 winning(%)
    const tie = probs["2"] ?? 0; // tie(%)

    // function for generate an image from the result card
    const generateImageFile = async () => {
        // safety: ref may be null
        if (!previewRef.current) return null;

        const canvas = await html2canvas(previewRef.current, { 
            scale: Math.min(window.devicePixelRatio * 3, 4), // for high resolution capture
            backgroundColor: "rgba(78, 27, 0, 0.34)" // white background for transperent sections
        });

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(
                    new File(
                        [blob],
                        `match_prediction_${team1Name}_vs_${team2Name}_by_CricZora.png`,
                        { type: "image/png" }
                    )
                )
            })
        })
    }

    // single function to prepare image (avoids repetition)
    const prepareImage = async () => {
        // already prepared
        if (generatedFile && previewUrl) return generatedFile;

        // show loading text
        setIsPreparing(true);
        const file = await generateImageFile();

        if (file) {
            setGeneratedFile(file); // save file for reuse
            setPreviewUrl(URL.createObjectURL(file)); // create preview url
        }

        setIsPreparing(false)
        return file;
    }

    // functions for open and close sharepopups
    // open sharepopup function
    const openSharePopup = async () => {
        await prepareImage(); // prepare image first
        setShowShare(true); // show popup
    };

    // close sharepopup function
    const closeSharePopup = () => {
        setIsClosing(true); // trigger css closing animation

        setTimeout(() => {
            // clean up object url(prevent memory leak)
            previewUrl && URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            setShowShare(false); // hide popup
            setIsClosing(false);
        }, 250); // match css animation duration
    }

    // function for share / download button actions 
    // function for share button
    const handleShare = async () => {
        const file = await prepareImage();
        if (!file) return;

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({
                    title: "Match Prediction",
                    text: `${team1Name} vs ${team2Name}`,
                    files: [file]
                })
                return;
            } catch (error) {
                console.log("Share cancelled");
            }
        }
        // fallback if sharing not supported
        handleDownload();
    }

    // function for download button
    const handleDownload = async () => {
        const file = await prepareImage();
        if (!file) return;

        // create tempory link
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        // suggest filename
        link.download = file.name;
        // trigger browser download
        link.click();
    }


    // State to hold chart data values for animation
    const [chartDataValues, setChartDataValues] = useState([0, 0, 0]);
    // Add this useEffect to update the data after a slight delay
    useEffect(() => {
        // Wait 300ms for the page fade-in to settle, then set real values
        const timer = setTimeout(() => {
            setChartDataValues([team1, team2, tie]);
        }, 300);

        return () => clearTimeout(timer);
    }, [team1, team2, tie]);


    // Responsive chart font size handling
    const [isMobile, setIsMobile] = useState(window.innerWidth < 650);
    // Update isMobile state on window resize
    useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 650);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);



    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <div className="result container">
                <div className="result-box">
                    {/* wraps everything that will be captured as image */}
                    <div className="result-card" ref={previewRef}>
                        <div className="watermark">
                            <p>Powered By</p>
                            <img src={logo} alt="CricZora" className="watermark-logo" />
                        </div>
                        <h2>Match Prediction Result</h2>

                        {/* BarChart */}
                        <div className="chart-wrapper">
                            <Bar
                                data={{
                                    labels: [`${team1Name} Win`, `${team2Name} Win`, "Tie / Draw"],
                                    datasets: [
                                        {
                                            label: "Match Winning Prediction (%)",
                                            data: chartDataValues, 
                                            backgroundColor: ["#ff3d00", "#ff8a00", "#ffb703"],
                                            borderWidth: 0,
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    animation: {
                                        duration: 1500,
                                        easing: "easeOutQuart"
                                    },
                                    plugins: {
                                        tooltip: { 
                                            titleFont: {
                                            size: isMobile ? 9 : 14
                                            },
                                            bodyFont: {
                                            size: isMobile ? 8 : 12
                                            }
                                        },
                                        legend: {
                                            labels: {
                                                color: "#adadad",
                                                font: {
                                                    size: isMobile ? 10 : 12
                                                },
                                            }
                                        }
                                    },
                                    scales: {
                                        x: {
                                            ticks: {
                                                color: "#adadad",
                                                maxRotation: isMobile ? 30 : 0,
                                                font: {
                                                    size: isMobile ? 9 : 12
                                                }
                                            },
                                            grid: {
                                                color: "rgba(255, 255, 255, 0.1)"
                                            }
                                        },
                                        y: {
                                            beginAtZero: true,
                                            max: 100,
                                            ticks: {
                                                color: "#adadad",
                                                stepSize: 20,
                                                font: {
                                                    size: isMobile ? 9 : 12
                                                }
                                            },
                                            grid: {
                                                color: "rgba(255, 255, 255, 0.1)"
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>

                        {/* shows prediction % + venue + toss info */}
                        <div className="value-box">
                            <div className="left">
                                <p><strong>{team1Name} (Team 1) :</strong> {team1}%</p>
                                <p><strong>{team2Name} (Team 2) :</strong> {team2}%</p>
                                <p><strong> Tie / Draw :</strong> {tie}%</p>
                            </div>
                            <div className="right">
                                <p><strong> Venue (Country) :</strong> {venue}</p>
                                <p><strong> Toss Winner :</strong> {toss_winner}</p>
                            </div>
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="result-buttons">
                        <button className="btn back-btn" onClick={()=> window.history.back()}>
                            Back to Predictor
                        </button>
                        <button className="btn share-btn" onClick={openSharePopup}>
                            Share Prediction
                        </button>
                    </div>

                    {/* Share PopUp */}
                    {showShare && (
                        // covers the screen, click outside close popup
                        <div className={`share-overlay ${isClosing ? "closing" : "open"}`} onClick={closeSharePopup}>
                            {/* this is the centered container */}
                            <div className="share-modal" onClick={(e)=>e.stopPropagation()}>

                                <button className="close-btn" onClick={closeSharePopup}>
                                    <img src={light_cross} alt="" />
                                </button>

                                <h3>Prediction Preview</h3>
                                
                                {/* shows “Preparing image…” before image is ready Buttons disabled while preparing to avoid errors */}
                                {isPreparing ? (
                                    <p>Preparing image...</p>
                                ) : (
                                    previewUrl && (
                                        <img 
                                            src={previewUrl} 
                                            alt="Prediction Preview"
                                            className="share-preview"
                                        />
                                    )
                                )}

                                <div className="share-actions">
                                    <button 
                                        className="btn popup-share-btn"
                                        onClick={handleShare}
                                        disabled={isPreparing}
                                    >
                                        <img src={light_share} alt="Share Icon" className="btn-icon" />
                                        Share
                                    </button>
                                    <button 
                                        className="btn popup-download-btn"
                                        onClick={handleDownload}
                                        disabled={isPreparing}
                                    >
                                        <img src={light_download} alt="Download Icon" className="btn-icon" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}