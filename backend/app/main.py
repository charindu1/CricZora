from fastapi import FastAPI, HTTPException
from app.model_utils import load_models, load_encoders, load_datasets, make_prediction
from app.schemas import PredictRequest
from fastapi.middleware.cors import CORSMiddleware

# Initialize the application instance
app = FastAPI()

# This section defines for allows to talk API
# origins=["*"], means any websites can call this api
# This is critical for allowing frontend to fetch data
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://criczora.vercel.app",
                   "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load resources for app_util.py
print("Booting up: Loading models, Encoders, and Datasets...")

MODELS = load_models()
ENCODERS = load_encoders()
DATASETS = load_datasets()

print("Server is ready")

# Initialize endpoints
# Endpoint to populate dropdown form of frontend
@app.get("/options/{match_format}")
def get_options(match_format: str):
    fmt = match_format.upper()
    if fmt not in ENCODERS:
        raise HTTPException(status_code=404, detail="Invalid match format")
    encoders = ENCODERS[fmt]

    all_teams = encoders["team"].classes_.tolist()
    valid_teams = [t for t in all_teams if str(t) != '0' and str(t).lower() != 'nan']
    
    all_venues = encoders["venue"].classes_.tolist()
    valid_venues = [v for v in all_venues if str(v) != '0' and str(v).lower() != 'nan']

    return {
        "teams": valid_teams,
        "venues": valid_venues,
        "toss_winners": valid_teams
    }

# Endpoint to calculate the actual probability
@app.post("/predict")
def predict(req: PredictRequest):
    fmt = req.match_format.upper()

    if fmt not in MODELS:
        raise HTTPException(status_code=400, detail="Invalid match format")
    
    try:
        result = make_prediction(req, MODELS[fmt], ENCODERS[fmt], DATASETS.get(fmt))
        return result
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    