import axios from "axios";

const API_URL = "https://charindu1-criczora-backend.hf.space";

// Get prediction from backend
export const getPrediction = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/predict`, payload);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Get options for teams, venues, etc. based on match format
export const getOptions = async (formatId) => {
  const res = await axios.get(`${API_URL}/options/${formatId}`);
  return res.data;
};