import joblib
from pathlib import Path
import numpy as np
import pandas as pd

# Configure the base path(backend folder) by initializing directory
# (here ".parent -> backend/app" and ".parent.parent -> backend/")
BASE_DIRECTORY = Path(__file__).resolve().parent.parent

# Configure models, encoders, and dataset from backend by initializing directories
MODEL_DIRECTORY = BASE_DIRECTORY / "models"
ENCODER_DIRECTORY = BASE_DIRECTORY / "encoders"
DATA_DICTIONARY = BASE_DIRECTORY / "data"

# Load and return models for all formats
def load_models():
    models = {
        "ODI": joblib.load(MODEL_DIRECTORY / "odi_model.pkl"),
        "T20": joblib.load(MODEL_DIRECTORY / "t20_model.pkl"),
        "TEST": joblib.load(MODEL_DIRECTORY / "test_model.pkl")
    }
    return models

# Load and return team, venue encoders for all formats
def load_encoders():
    encoders = {
        "ODI": {
            "team": joblib.load(ENCODER_DIRECTORY / "odi_team_encoder.pkl"),
            "venue": joblib.load(ENCODER_DIRECTORY / "odi_venue_encoder.pkl")
        },
        "T20": {
            "team": joblib.load(ENCODER_DIRECTORY / "t20_team_encoder.pkl"),
            "venue": joblib.load(ENCODER_DIRECTORY / "t20_venue_encoder.pkl")
        },
        "TEST": {
            "team": joblib.load(ENCODER_DIRECTORY / "test_team_encoder.pkl"),
            "venue": joblib.load(ENCODER_DIRECTORY / "test_venue_encoder.pkl")
        }
    }
    return encoders

# Load datasets for all formats
def load_datasets():
    datasets = {}
    files = {
        "ODI": "odi.csv",
        "T20": "t20.csv",
        "TEST": "test.csv"
    }

    for key, filename in files.items():
        path = DATA_DICTIONARY / filename
        if not path.exists():
            path = Path(filename)

        if path.exists():
            datasets[key] = pd.read_csv(path)
            print(f"Loaded {key} data from {path}")
        else:
            print(f"Missing {key} data at {path}")
            datasets[key] = None

    return datasets

# Calculate mean for runs and wickets for both teams (for t20 and odi formats)
def get_mean_stat(data, t1, t2):
    if data is None:
        return np.nan, np.nan, np.nan, np.nan
    
    # Filter data for head-to-head matches between t1(team1) and t2(team2)
    t1_as_team1 = data[(data['Team1 Name'] == t1) & (data['Team2 Name'] == t2)]
    t1_as_team2 = data[(data['Team1 Name'] == t2) & (data['Team2 Name'] == t1)]

    # Combine runs and wickets data for both teams
    t1_runs = pd.concat([t1_as_team1['Team1 Runs Scored'], t1_as_team2['Team2 Runs Scored']], ignore_index=True)
    t1_wickets = pd.concat([t1_as_team1['Team1 Wickets Fell'], t1_as_team2['Team2 Wickets Fell']], ignore_index=True)
    t2_runs = pd.concat([t1_as_team1['Team2 Runs Scored'], t1_as_team2['Team1 Runs Scored']], ignore_index=True)
    t2_wickets = pd.concat([t1_as_team1['Team2 Wickets Fell'], t1_as_team2['Team1 Wickets Fell']], ignore_index=True)

    # Return mean values, handling empty series properly
    return (
        t1_runs.mean() if not t1_runs.empty else np.nan,
        t1_wickets.mean() if not t1_wickets.empty else np.nan,
        t2_runs.mean() if not t2_runs.empty else np.nan,
        t2_wickets.mean() if not t2_wickets.empty else np.nan
    )

# Make prediction
def make_prediction(req, model, encoders, data):

    # Initialize encoders
    team_encoder = encoders["team"]
    venue_encoder = encoders["venue"]

    # Encode inputs
    try:
        team1_encoder = team_encoder.transform([req.team1])[0]
        team2_encoder = team_encoder.transform([req.team2])[0]
        toss_encoder = team_encoder.transform([req.toss_winner])[0]
        venue_encoder_value = venue_encoder.transform([req.venue])[0]
    except ValueError as e:
        raise ValueError(f"Invalid Team/Venue name: {e}")
    
    # Prepare features
    n_features = getattr(model, "n_features_in_", 8)

    # Consider inputs for whiteball and redball formats seperately
    # For redball format
    if n_features == 4:
        input_dict = {
            "Team1 Name": team1_encoder,
            "Team2 Name": team2_encoder,
            "Match Venue (Country)": venue_encoder_value,
            "Toss Winner" : toss_encoder
        }
        X = pd.DataFrame([input_dict])
        X = X[["Team1 Name", "Team2 Name", "Match Venue (Country)", "Toss Winner"]]
    else:
        if data is None:
            raise ValueError(f"Historical data missing. Can not calculate stats for this model")

        # For whiteball format
        t1_runs, t1_wickets, t2_runs, t2_wickets = get_mean_stat(data, req.team1, req.team2)

        input_dict = {
            "Team1 Name": team1_encoder,
            "Team2 Name": team2_encoder,
            "Match Venue (Country)": venue_encoder_value,
            "Toss Winner": toss_encoder,
            "Team1 Runs Scored": t1_runs,
            "Team1 Wickets Fell": t1_wickets,
            "Team2 Runs Scored": t2_runs,
            "Team2 Wickets Fell": t2_wickets
        }

        # Fill NaNs with global averages
        if pd.isna(input_dict["Team1 Runs Scored"]): input_dict["Team1 Runs Scored"] = data['Team1 Runs Scored'].mean()
        if pd.isna(input_dict["Team1 Wickets Fell"]): input_dict["Team1 Wickets Fell"] = data['Team1 Wickets Fell'].mean()
        if pd.isna(input_dict["Team2 Runs Scored"]): input_dict["Team2 Runs Scored"] = data['Team2 Runs Scored'].mean()
        if pd.isna(input_dict["Team2 Wickets Fell"]): input_dict["Team2 Wickets Fell"] = data['Team2 Wickets Fell'].mean()

        X = pd.DataFrame([input_dict])
        # Ensure column order matches original training
        cols_8 = ["Team1 Name", "Team2 Name", "Match Venue (Country)", "Toss Winner",
                  "Team1 Runs Scored", "Team1 Wickets Fell", "Team2 Runs Scored", "Team2 Wickets Fell"]
        X = X[cols_8]

    # Predict and format data
    probabilities = model.predict_proba(X)[0]
    classes = model.classes_

    team1_prob = 0.0
    team2_prob = 0.0
    tie_prob = 0.0

    for cls, prob in zip(classes, probabilities):
        if cls == team1_encoder:
            team1_prob = prob * 100
        elif cls == team2_encoder:
            team2_prob = prob * 100
        elif cls == 0:
            tie_prob = prob * 100

    total = team1_prob + team2_prob + tie_prob
    if total > 0:
        team1_prob = round((team1_prob / total) * 100, 2)
        team2_prob = round((team2_prob / total) * 100, 2)
        tie_prob = round((tie_prob / total) * 100, 2)

    return {
        "labels": [req.team1, req.team2, "Tie/Draw"],
        "probabilities": {
            "1": team1_prob,
            "0": team2_prob,
            "2": tie_prob
        }
    }