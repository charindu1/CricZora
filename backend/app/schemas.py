from pydantic import BaseModel

# Ensure what are the datatype include in user inputs
class PredictRequest(BaseModel):
    match_format: str
    team1: str
    team2: str
    venue: str
    toss_winner: str