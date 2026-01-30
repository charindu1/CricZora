import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from "axios"
import { getPrediction, getOptions  } from "../api/api";
import AutoSelect from "../components/AutoSelect";
import './Form.css'
import light_forward_arrow from '../assets/light-forward-arrow.svg';
import light_backward_arrow from '../assets/light-backward-arrow.svg'
import { motion } from "framer-motion";
import usePageTitle from "../hooks/usePageTitle";

export default function Form() {
    // grb the formatId from the URL
    const { formatId } = useParams();

    // allowws to change pages via code
    const navigate = useNavigate();

    // hold the actual data the user selected
    const [form, setForm] = useState({
        match_format: formatId,
        team1: "",
        team2: "",
        venue: "",
        toss_winner: ""
    });

    // holds the lists populated from the backend(list of all teams, venues)
    const [options, setOptions] = useState({
        teams: [],
        venues: [],
        toss_winners: []
    });

    // initialize loading spinner ans alert notifications
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState(null);

    // show in browser tab which page is this
    usePageTitle(`CricZora - ${formatId.toUpperCase()} Predict`);

    // fetches the valid teams/venues for the specific match format
    useEffect(() => {
        if (!formatId) return;

        const loadOptions = async () => {
            try {
                setLoading(true);

                const data = await getOptions(formatId);
                setOptions(data);

                setForm(prev => ({ ...prev, match_format: formatId }));
            } catch (error) {
                showAlert(Date.now(), "error", "Failed to load options");
            } finally {
                setLoading(false);
            }
        };

        loadOptions();
    }, [formatId]);

    // set a timer to close toast alerts
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
               setAlert(null); 
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    // helper function to keep alert code clean
    const showAlert = (id, type, message) => {
        setAlert({ id, type, message });
    };

    // FROM SUBMISSION HANDLER
    const handleSubmit  = async (e) => {
        e.preventDefault(); //prevent browser from refreshing the page

        // get exact inputs (no timming)
        const team1Input = form.team1;
        const team2Input = form.team2;
        const venueInput = form.venue;
        const tossInput = form.toss_winner;
        
        // Validation: check for empty fields
        if (!team1Input || !team2Input || !venueInput || !tossInput) {
            showAlert(Date.now(), "error", "Please select all fields");
            return;
        }

        // Validation: shouldn't same the team1 and team2
        if (team1Input === team2Input) {
            showAlert(Date.now(), "error", "Team 1 and Team 2 cannot be the same");
            return;
        }

        // Validation: Toss winner must be play
        if (tossInput !== team1Input && tossInput !== team2Input) {
            showAlert(Date.now(), "error", "Toss Winner must be either Team 1 or Team 2");
            return;
        }

        // start button loading state
        setIsSubmitting(true);

        try {
            //prepare data for fastapi
            const payload = {
                match_format: form.match_format,
                team1: team1Input,
                team2: team2Input,
                venue: venueInput,
                toss_winner: tossInput
            };

            // send to backend
            const data = await getPrediction(payload);

            // show success message before navigating away
            showAlert(Date.now(), "success", "Prediction Successful! Redirecting...");

            // wait 2.5s in Form page, to see success message 2.5s times and pass data to Result page
            setTimeout(() => {
                navigate(`/predict/${formatId}/result`, { 
                    state: { 
                        data, 
                        venue: venueInput, 
                        toss_winner: tossInput, 
                        match_format: form.match_format 
                    }
                });
            }, 2500);
        } catch (error) {
            // stop button loading on error
            setIsSubmitting(false);
            const errorMsg = error.response?.data?.detail || "Prediction failed";
            showAlert(Date.now(), "error", errorMsg);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <div className="form container">
                {/* TOAST UI phase */}
                {alert && (
                    <div className="toast-container" key={alert.id}>
                        <div className={`alert-box ${alert.type}`}>
                            <span className="alert-icon">
                                {alert.type === "success" ? "✔" : "!"}
                            </span>

                            <span className="alert-text"> {alert.message} </span>

                            {/* close button */}
                            <button 
                                className="alert-close-btn"
                                onClick={() => setAlert(null)}
                            >
                                ✖
                            </button>
                        </div>
                    </div>
                )}

                <div className="form-wrapper">
                    <Link to="/predict">
                        <div className="nav-back">
                            <img src={light_backward_arrow} alt="" />
                            Back
                        </div>
                    </Link>

                    <div className="form-card">
                        <h2 className="form-title">
                            <span className="highlight">{formatId?.toUpperCase()}</span> Winning Predictor
                        </h2>

                        {/* Show loading text if data isn't ready, otherwise show form */}
                        {loading ? (
                            <p className="loading-text"> Loading teams & venues... </p>
                        ) : (
                            <>
                                {/* make form fields using reuseable AutoSelect component */}
                                <AutoSelect 
                                    label="Team 1"
                                    options={options.teams}
                                    value={form.team1}
                                    onChange={(val) => setForm({ ...form, team1: val })}
                                />

                                <AutoSelect
                                    label="Team 2"
                                    options={options.teams}
                                    value={form.team2}
                                    onChange={(val) => setForm({ ...form, team2: val })}
                                />

                                <AutoSelect
                                    label="Match Venue (Country)"
                                    options={options.venues}
                                    value={form.venue}
                                    onChange={(val) => setForm({ ...form, venue: val })}
                                />

                                <AutoSelect
                                    label="Toss Winner"
                                    options={options.teams}
                                    value={form.toss_winner}
                                    onChange={(val) => setForm({ ...form, toss_winner: val })}  
                                />

                                {/* Submit button with loading state */}
                                <button 
                                    className={`btn-zora btn-predict ${isSubmitting ? "btn-disabled" : ""}`} 
                                    onClick={handleSubmit}
                                    disabled={isSubmitting} // Disable click while loading
                                >
                                    {isSubmitting ? (
                                        <div className="btn-loader"></div>
                                    ) : (
                                        <span className="btn-content">
                                            Predict Results
                                            <img src={light_forward_arrow} alt="button arrow" />
                                        </span>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}