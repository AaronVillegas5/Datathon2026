from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import joblib
from Asthma.asthma_statistics import add_percentile_rankings
from Asthma.asthma_model import load_model, load_and_clean_data, predict_full_dataset

# Initialize FastAPI
app = FastAPI(title="Asthma Risk API", version="1.0")

# ---------------------------
# Load model & data at startup
# ---------------------------
XGB_MODEL_PATH = "Asthma/best_xgb_model.pkl"
DATA_PATH = "Asthma/data.csv"

#ASTHMA--------------------------------------------------------------------------------
df_clean, X, y = load_and_clean_data(DATA_PATH)
asthma_model = load_model(XGB_MODEL_PATH)

# Add predictions and percentiles for all ZIPs
df_clean["pred_asthma_pctl"] = asthma_model.predict(X)
df_clean = add_percentile_rankings(df_clean, pred_col="pred_asthma_pctl")


#Cardiovascular--------------------------------------------------------------------------------
FEATURES = [
    "Ozone", "PM2.5", "Diesel PM", "Drinking Water", "Lead", "Pesticides", "Traffic", "Cleanup Sites", "Groundwater Threats", "Haz Waste", "Imp Water Bodies", "Solid Waste", "Education", "Linguistic Isolation", "Poverty", "Unemployment", "Housing Burden"
]

def load_cardio_model(path="Cardio/cardiovascular_model.pkl"):
    return joblib.load(path)

def load_cardio_data(csv_path):
    df = pd.read_csv(csv_path)
    df = df.dropna(subset=FEATURES)
    X = df[FEATURES]
    return df, X

def predict_cardio(df, X, model):
    df = df.copy()
    df["pred_cardio"] = model.predict(X)
    return df


# ---------------------------
# Request / Response Models
# ---------------------------
class ZIPRequest(BaseModel):
    zip_codes: List[str]

class ZIPResponse(BaseModel):
    ZIP: str
    pred_asthma_pctl: float
    state_percentile: float
    county_percentile: float
    top_5_state: bool
    top_10_county: bool

# ---------------------------
# API Endpoints
# ---------------------------
@app.get("/")
def read_root():
    return {"message": "Welcome to the Healthy Home API!"}

@app.get("/top-risk-asthma")
def get_top_risk(percentile: float = 90):
    top_df = df_clean[df_clean["pred_asthma_pctl"] >= percentile].copy()
    return top_df[["ZIP", "pred_asthma_pctl", "state_percentile", "county_percentile",
                   "top_5_state", "top_10_county"]].to_dict(orient="records")

@app.post("/predict-asthma", response_model=List[ZIPResponse])
def predict_zip(request: ZIPRequest):
    zips = request.zip_codes
    filtered = df_clean[df_clean["ZIP"].isin(zips)].copy()
    response = filtered[["ZIP", "pred_asthma_pctl", "state_percentile", "county_percentile",
                         "top_5_state", "top_10_county"]].to_dict(orient="records")
    return response
