from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd
import numpy as np
import joblib
import math

from Asthma.asthma_statistics import add_percentile_rankings
from Asthma.asthma_model import load_model, load_and_clean_data
from health_index.health_index_score import compute_hvi_for_zips, get_top_hvi

# ---------------------------
# Initialize FastAPI
# ---------------------------
app = FastAPI(title="Healthy Home API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
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
asthma_df["ZIP"] = asthma_df["ZIP"].astype(str).str.strip()

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

missing_features = set(CARDIO_FEATURES) - set(asthma_df.columns)
if missing_features:
    raise ValueError(f"Missing features in asthma_df for cardio prediction: {missing_features}")

for col in CARDIO_FEATURES:
    asthma_df[col] = pd.to_numeric(asthma_df[col], errors='coerce').fillna(0)

cardio_X = asthma_df[CARDIO_FEATURES]
asthma_df["pred_cardio"] = cardio_model.predict(cardio_X)
asthma_df = add_percentile_rankings(asthma_df, pred_col="pred_cardio")
asthma_df = asthma_df.rename(columns={
    "state_percentile": "state_percentile_cardio",
    "county_percentile": "county_percentile_cardio"
})

# ---------------------------
# Load Melissa ZIP geocode table
# (has lat/lng for every US zip code)
# ---------------------------
melissa_df = pd.read_csv("Asthma/Melissa_zipcodes.csv")
melissa_df["ZipCode"] = melissa_df["ZipCode"].astype(str).str.zfill(5)
melissa_df = melissa_df.drop_duplicates(subset="ZipCode")

# Build a lat/lng lookup for known zips in our dataset
# using the Melissa table (more complete than data.csv coords)
known_zip_coords = (
    asthma_df[["ZIP", "Latitude", "Longitude"]].copy()
    .rename(columns={"Latitude": "lat", "Longitude": "lng"})
    .dropna(subset=["lat", "lng"])
    .drop_duplicates(subset="ZIP")
)
known_zip_coords["lat"] = pd.to_numeric(known_zip_coords["lat"], errors="coerce")
known_zip_coords["lng"] = pd.to_numeric(known_zip_coords["lng"], errors="coerce")
known_zip_coords = known_zip_coords.dropna()

# ---------------------------
# Haversine distance (km)
# ---------------------------
def haversine(lat1, lng1, lat2, lng2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2
         + math.cos(math.radians(lat1))
         * math.cos(math.radians(lat2))
         * math.sin(dlng / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def find_nearest_zip(lat: float, lng: float) -> str:
    """Return the nearest known ZIP code in our dataset by haversine distance."""
    coords = known_zip_coords.copy()
    coords["dist"] = coords.apply(
        lambda r: haversine(lat, lng, r["lat"], r["lng"]), axis=1
    )
    return coords.loc[coords["dist"].idxmin(), "ZIP"]

# ---------------------------
# Request / Response Models
# ---------------------------
class ZIPRequest(BaseModel):
    zip_codes: List[str]

class UnknownZIPRequest(BaseModel):
    zip_code: str

# ---------------------------
# API Endpoints
# ---------------------------
@app.get("/")
def read_root():
    return {"message": "Healthy Home API running!"}

# ----- Unknown ZIP prediction -----
@app.post("/predict-unknown-zip")
def predict_unknown_zip(request: UnknownZIPRequest):
    zip_code = request.zip_code.strip().zfill(5)

    # 1. Geocode via Melissa table
    melissa_row = melissa_df[melissa_df["ZipCode"] == zip_code]
    if melissa_row.empty:
        raise HTTPException(status_code=404, detail=f"ZIP {zip_code} not found in geocode database")

    lat = float(melissa_row.iloc[0]["Latitude"])
    lng = float(melissa_row.iloc[0]["Longitude"])
    city = str(melissa_row.iloc[0]["City"])

    # 2. Find nearest known ZIP in our CalEnviroScreen dataset
    nearest_zip = find_nearest_zip(lat, lng)
    nearest_row = asthma_df[asthma_df["ZIP"] == nearest_zip].iloc[0]
    nearest_lat = known_zip_coords[known_zip_coords["ZIP"] == nearest_zip].iloc[0]["lat"]
    nearest_lng = known_zip_coords[known_zip_coords["ZIP"] == nearest_zip].iloc[0]["lng"]
    distance_km = haversine(lat, lng, nearest_lat, nearest_lng)

    # 3. Use nearest ZIP's features to predict via both models
    asthma_features = [
        "Total Population", "Traffic", "Ozone", "PM2.5",
        "Diesel PM", "Drinking Water", "Lead", "Pesticides",
        "Cleanup Sites", "Groundwater Threats", "Haz. Waste",
        "Imp. Water Bodies", "Solid Waste", "Education",
        "Linguistic Isolation", "Unemployment", "Housing Burden"
    ]
    X_asthma = np.array(nearest_row[asthma_features].values, dtype=float).reshape(1, -1)
    X_cardio  = np.array(nearest_row[CARDIO_FEATURES].values, dtype=float).reshape(1, -1)

    pred_asthma = float(asthma_model.predict(X_asthma)[0])
    pred_cardio = float(cardio_model.predict(X_cardio)[0])

    # 4. Pull other percentile columns directly from the nearest row
    def safe(col):
        val = nearest_row.get(col, np.nan)
        num = pd.to_numeric(val, errors='coerce')
        return round(float(num), 1) if not pd.isna(num) else None

    return {
        "zip": zip_code,
        "city": str(city),
        "estimated": True,
        "nearest_zip": nearest_zip,
        "nearest_city": str(nearest_row.get("Approximate Location", "")).strip(),
        "distance_km": round(distance_km, 1),
        # Model predictions
        "asthma": round(pred_asthma, 1),
        "cardio": round(pred_cardio, 1),
        # Pull remaining indicators from nearest zip's data
        "toxRelease": safe("Tox. Release Pctl"),
        "lowBirth":   safe("Low Birth Weight Pctl"),
        "pm25":       safe("PM2.5 Pctl"),
        "traffic":    safe("Traffic Pctl"),
        "poverty":    safe("Poverty Pctl"),
        "education":  safe("Education Pctl"),
        "score":      safe("CES 4.0 Percentile"),
        "totalPop":   int(nearest_row.get("Total Population", 0)) if not pd.isna(nearest_row.get("Total Population", np.nan)) else None,
    }

# ----- Batch predict all Melissa zips not in CES dataset -----
@app.get("/predict-all-unknown")
def predict_all_unknown():
    known_zips = set(asthma_df["ZIP"].unique())
    melissa_zips = set(melissa_df["ZipCode"].unique())
    unknown_zips = melissa_zips - known_zips

    asthma_features = [
        "Total Population", "Traffic", "Ozone", "PM2.5",
        "Diesel PM", "Drinking Water", "Lead", "Pesticides",
        "Cleanup Sites", "Groundwater Threats", "Haz. Waste",
        "Imp. Water Bodies", "Solid Waste", "Education",
        "Linguistic Isolation", "Unemployment", "Housing Burden"
    ]

    results = {}
    for zip_code in unknown_zips:
        mel_row = melissa_df[melissa_df["ZipCode"] == zip_code]
        if mel_row.empty:
            continue
        try:
            lat = float(mel_row.iloc[0]["Latitude"])
            lng = float(mel_row.iloc[0]["Longitude"])
            city = str(mel_row.iloc[0]["City"]).title()
        except:
            continue

        nearest_zip = find_nearest_zip(lat, lng)
        nearest_row = asthma_df[asthma_df["ZIP"] == nearest_zip].iloc[0]

        try:
            X_asthma = np.array(nearest_row[asthma_features].values, dtype=float).reshape(1, -1)
            X_cardio  = np.array(nearest_row[CARDIO_FEATURES].values, dtype=float).reshape(1, -1)
            pred_asthma = float(asthma_model.predict(X_asthma)[0])
            pred_cardio = float(cardio_model.predict(X_cardio)[0])
        except:
            continue

        def safe(col):
            val = nearest_row.get(col, np.nan)
            num = pd.to_numeric(val, errors='coerce')
            return round(float(num), 1) if not pd.isna(num) else 50.0

        results[zip_code] = {
            "name": city,
            "score": safe("CES 4.0 Percentile"),
            "asthma": round(pred_asthma, 1),
            "cardio": round(pred_cardio, 1),
            "toxRelease": safe("Tox. Release Pctl"),
            "lowBirth":   safe("Low Birth Weight Pctl"),
            "pm25":       safe("PM2.5 Pctl"),
            "traffic":    safe("Traffic Pctl"),
            "poverty":    safe("Poverty Pctl"),
            "education":  safe("Education Pctl"),
            "totalPop":   int(nearest_row.get("Total Population", 0)) if not pd.isna(nearest_row.get("Total Population", np.nan)) else None,
            "tractCount": "—",
            "hispanic": None, "white": None, "asian": None, "black": None,
            "estimated": True,
            "nearestZip": nearest_zip,
            "nearestCity": str(nearest_row.get("Approximate Location", "")).strip(),
            "distanceKm": round(haversine(lat, lng,
                float(known_zip_coords[known_zip_coords["ZIP"] == nearest_zip].iloc[0]["lat"]),
                float(known_zip_coords[known_zip_coords["ZIP"] == nearest_zip].iloc[0]["lng"])), 1),
        }

    return results

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

    return result_unique.to_dict(orient="records")

@app.get("/top-risk-asthma")
def top_risk_asthma(percentile: float = 90):
    top_df = asthma_df[asthma_df["pred_asthma"] >= percentile].copy()
    return top_df[[
        "ZIP", "pred_asthma",
        "state_percentile_asthma", "county_percentile_asthma",
        "top_5_state", "top_10_county"
    ]].to_dict(orient="records")

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

    return result_unique.to_dict(orient="records")

# ----- Health Index -----
@app.post("/get-hvi")
def get_hvi(request: ZIPRequest):
    return compute_hvi_for_zips(request.zip_codes)

@app.get("/top-vulnerable")
def top_vulnerable(n: int = 10):
    results = get_top_hvi(n)
    # Merge in asthma/cardio predictions and city name from our enriched dataframe
    enriched = []
    for item in results:
        zip_code = str(item["ZIP"]).zfill(5)
        row = asthma_df[asthma_df["ZIP"] == zip_code]
        if not row.empty:
            r = row.iloc[0]
            item["pred_asthma"] = round(float(r["pred_asthma"]), 1) if not pd.isna(r["pred_asthma"]) else None
            item["pred_cardio"] = round(float(r["pred_cardio"]), 1) if not pd.isna(r["pred_cardio"]) else None
            item["state_percentile_asthma"] = round(float(r["state_percentile_asthma"]), 1) if not pd.isna(r["state_percentile_asthma"]) else None
            item["state_percentile_cardio"] = round(float(r["state_percentile_cardio"]), 1) if not pd.isna(r["state_percentile_cardio"]) else None
            item["city"] = str(r.get("Approximate Location", "")).strip()
        item["hvi_score"] = item.pop("HVI", None)
        enriched.append(item)
    return enriched
