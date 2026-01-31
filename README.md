# CricZora - International Cricket Match Predictor

CricZora is a full-stack web application that uses Machine Learning to predict the winning probability of international cricket matches across T20, ODI, and Test formats.

* Live Demo : https://criczora.vercel.app

## Features
* Implemented ML models for T20, ODI, and Test matches.
* Interactive form with Auto-completion for teams and venues.
* Instant winning probability calculations.
* Fully optimized for both Mobile and Desktop users (Responsiveness).

## Tech Stack
- **Frontend:** React.js, Framer Motion (for animations), CSS3
- **Backend:** FastAPI in Python
- **Machine Learning:** Scikit-learn, Pandas, Numpy, and using Jupyter Lite
- **Deployment:** Vercel (Frontend), Backend (Hugging Face)

## Installation & Setup
**1. Clone the rerepository:**
   ```bash
   git clone [https://github.com/charindu1/CricZora.git](https://github.com/charindu1/CricZora.git)
```

**2. Frontend Setup:**
```bash
  cd frontend
  npm install
  npm run dev
```

**3. Backend Setup:**
```bash
  cd backend
  pip install -r requirements.txt
  uvicorn main:app --reload
```
