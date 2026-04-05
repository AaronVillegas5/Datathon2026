from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import pandas as pd
import joblib
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

from Asthma.asthma_statistics import add_percentile_rankings
from Asthma.asthma_model import load_model, load_and_clean_data
from health_index.health_index_score import compute_hvi_for_zips, get_top_hvi

# ---------------------------
# Helper function to convert numpy types to Python types for JSON serialization
# ---------------------------
def convert_numpy_types(obj):
    if isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, (np.integer, np.int64, np.int32, np.int16, np.int8)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64, np.float32, np.float16)):
        return float(obj)
    elif isinstance(obj, np.bool_):
        return bool(obj)
    else:
        return obj

# ---------------------------
# Initialize FastAPI
# ---------------------------
app = FastAPI(title="Healthy Home API", version="1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# ---------------------------
# Load ASTHMA data & model
# ---------------------------
ASTHMA_DATA_PATH = "Asthma/data.csv"
ASTHMA_MODEL_PATH = "Asthma/best_xgb_model.pkl"

asthma_df, asthma_X, _ = load_and_clean_data(ASTHMA_DATA_PATH)
asthma_model = load_model(ASTHMA_MODEL_PATH)

# Add asthma predictions & percentiles (full dataset)
asthma_df["pred_asthma"] = asthma_model.predict(asthma_X)
asthma_df = add_percentile_rankings(asthma_df, pred_col="pred_asthma")
asthma_df = asthma_df.rename(columns={
    "state_percentile": "state_percentile_asthma",
    "county_percentile": "county_percentile_asthma"
})
asthma_df["ZIP"] = asthma_df["ZIP"].astype(str)

# ---------------------------
# Load CARDIO model
# ---------------------------
CARDIO_MODEL_PATH = "Cardiovascular/cardiovascular_model.pkl"
CARDIO_FEATURES = [
    "Ozone", "PM2.5", "Diesel PM", "Drinking Water", "Lead", "Pesticides",
    "Traffic", "Cleanup Sites", "Groundwater Threats", "Haz. Waste",
    "Imp. Water Bodies", "Solid Waste", "Education", "Linguistic Isolation",
    "Poverty", "Unemployment", "Housing Burden"
]

cardio_model = joblib.load(CARDIO_MODEL_PATH)

# ---------------------------
# Add cardiovascular predictions & percentiles
# ---------------------------
missing_features = set(CARDIO_FEATURES) - set(asthma_df.columns)
if missing_features:
    raise ValueError(f"Missing features in asthma_df for cardio prediction: {missing_features}")

cardio_X = asthma_df[CARDIO_FEATURES]
asthma_df["pred_cardio"] = cardio_model.predict(cardio_X)
asthma_df = add_percentile_rankings(
    asthma_df, pred_col="pred_cardio")
asthma_df = asthma_df.rename(columns={
    "state_percentile": "state_percentile_cardio",
    "county_percentile": "county_percentile_cardio"
})


# ---------------------------
# Request / Response Models
# ---------------------------
class ZIPRequest(BaseModel):
    zip_codes: List[str]

# ---------------------------
# API Endpoints
# ---------------------------
@app.get("/")
def read_root():
    return {"message": "Healthy Home API running!"}

# ----- Asthma -----
@app.post("/predict-asthma")
def predict_asthma(request: ZIPRequest):
    zips = [z.zfill(5) for z in request.zip_codes]
    result = asthma_df[asthma_df["ZIP"].isin(zips)].copy()

    missing_zips = set(zips) - set(asthma_df["ZIP"])
    if missing_zips:
        print(f"Warning: These ZIPs not in dataset: {missing_zips}")

    result_unique = result.groupby(["ZIP", "California County"]).agg({
        "pred_asthma": "mean",
        "state_percentile_asthma": "mean",
        "county_percentile_asthma": "mean",
        "top_5_state": "max",
        "top_10_county": "max"
    }).reset_index()

    return convert_numpy_types(result_unique.to_dict(orient="records"))

@app.get("/top-risk-asthma")
def top_risk_asthma(percentile: float = 90):
    top_df = asthma_df[asthma_df["pred_asthma"] >= percentile].copy()
    return convert_numpy_types(top_df[[
        "ZIP", "pred_asthma",
        "state_percentile_asthma", "county_percentile_asthma",
        "top_5_state", "top_10_county"
    ]].to_dict(orient="records"))

# ----- Cardiovascular -----
@app.post("/predict-cardiovascular")
def predict_cardiovascular(request: ZIPRequest):
    zips = [z.zfill(5) for z in request.zip_codes]
    result = asthma_df[asthma_df["ZIP"].isin(zips)].copy()

    missing_zips = set(zips) - set(asthma_df["ZIP"])
    if missing_zips:
        print(f"Warning: These ZIPs not in dataset: {missing_zips}")

    result_unique = result.groupby(["ZIP", "California County"]).agg({
        "pred_cardio": "mean",
        "state_percentile_cardio": "mean",
        "county_percentile_cardio": "mean",
        "top_5_state": "max",
        "top_10_county": "max"
    }).reset_index()

    return convert_numpy_types(result_unique.to_dict(orient="records"))

# Health Index endpoints
@app.post("/get-hvi")
def get_hvi(request: ZIPRequest):
    result = compute_hvi_for_zips(request.zip_codes)
    
    # Merge with asthma and cardio predictions
    enhanced_result = []
    for item in result:
        zip_code = item.get("ZIP")
        asthma_row = asthma_df[asthma_df["ZIP"] == zip_code]
        
        if not asthma_row.empty:
            item["pred_asthma"] = asthma_row.iloc[0].get("pred_asthma", 0)
            item["state_percentile_asthma"] = asthma_row.iloc[0].get("state_percentile_asthma", 0)
            item["county_percentile_asthma"] = asthma_row.iloc[0].get("county_percentile_asthma", 0)
            item["pred_cardio"] = asthma_row.iloc[0].get("pred_cardio", 0)
            item["state_percentile_cardio"] = asthma_row.iloc[0].get("state_percentile_cardio", 0)
            item["county_percentile_cardio"] = asthma_row.iloc[0].get("county_percentile_cardio", 0)
        
        enhanced_result.append(item)
    
    return convert_numpy_types(enhanced_result)

@app.get("/top-vulnerable")
def top_vulnerable(n: int = 10):
    result = get_top_hvi(n)
    
    # Since get_top_hvi doesn't have access to asthma/cardio data, 
    # we need to enhance the results here
    enhanced_result = []
    for item in result:
        zip_code = str(item.get("ZIP", "")).zfill(5)
        asthma_row = asthma_df[asthma_df["ZIP"] == zip_code]
        
        if not asthma_row.empty:
            item["pred_asthma"] = float(asthma_row.iloc[0].get("pred_asthma", 0))
            item["state_percentile_asthma"] = float(asthma_row.iloc[0].get("state_percentile_asthma", 0))
            item["county_percentile_asthma"] = float(asthma_row.iloc[0].get("county_percentile_asthma", 0))
            item["pred_cardio"] = float(asthma_row.iloc[0].get("pred_cardio", 0))
            item["state_percentile_cardio"] = float(asthma_row.iloc[0].get("state_percentile_cardio", 0))
            item["county_percentile_cardio"] = float(asthma_row.iloc[0].get("county_percentile_cardio", 0))
        else:
            item["pred_asthma"] = None
            item["state_percentile_asthma"] = None
            item["county_percentile_asthma"] = None
            item["pred_cardio"] = None
            item["state_percentile_cardio"] = None
            item["county_percentile_cardio"] = None
        
        enhanced_result.append(item)
    
    return convert_numpy_types(enhanced_result)
