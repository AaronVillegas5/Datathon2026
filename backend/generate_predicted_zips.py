"""
Generate frontend/src/data/predictedZips.js for all Melissa ZIP codes not in ZIPS.js (OC dataset).
Covers both:
  - ZIPs that exist in CES data but aren't in the OC-only zips.js
  - ZIPs not in CES data at all (estimated from nearest ZIP)
"""

import sys, json, math
from pathlib import Path
import pandas as pd
import numpy as np
import joblib

CURRENT_DIR = Path(__file__).resolve().parent
BASE_DIR = CURRENT_DIR.parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

try:
    from .Asthma.asthma_model import load_model, load_and_clean_data
    from .Asthma.asthma_statistics import add_percentile_rankings
except ImportError:
    from Asthma.asthma_model import load_model, load_and_clean_data
    from Asthma.asthma_statistics import add_percentile_rankings

# ── Load CES data & models ──────────────────────────────────────────────────
ASTHMA_DATA_PATH = BASE_DIR / "data" / "data.csv"
asthma_df, asthma_X, _ = load_and_clean_data(ASTHMA_DATA_PATH)
asthma_model = load_model(BASE_DIR / "models" / "best_xgb_model.pkl")
cardio_model  = joblib.load(BASE_DIR / "models" / "cardiovascular_model.pkl")

CARDIO_FEATURES = [
    "Ozone", "PM2.5", "Diesel PM", "Drinking Water", "Lead", "Pesticides",
    "Traffic", "Cleanup Sites", "Groundwater Threats", "Haz. Waste",
    "Imp. Water Bodies", "Solid Waste", "Education", "Linguistic Isolation",
    "Poverty", "Unemployment", "Housing Burden"
]

asthma_df["pred_asthma"] = asthma_model.predict(asthma_X)
asthma_df = add_percentile_rankings(asthma_df, pred_col="pred_asthma")
asthma_df = asthma_df.rename(columns={
    "state_percentile": "state_percentile_asthma",
    "county_percentile": "county_percentile_asthma",
})

for col in CARDIO_FEATURES:
    asthma_df[col] = pd.to_numeric(asthma_df[col], errors="coerce").fillna(0)

cardio_X = asthma_df[CARDIO_FEATURES]
asthma_df["pred_cardio"] = cardio_model.predict(cardio_X)
asthma_df["ZIP"] = asthma_df["ZIP"].astype(str).str.strip().str.zfill(5)

# ── Load Melissa geocode table ───────────────────────────────────────────────
melissa_df = pd.read_csv(BASE_DIR / "data" / "Melissa_zipcodes.csv")
melissa_df.columns = melissa_df.columns.str.strip()
melissa_df["ZipCode"] = melissa_df["ZipCode"].astype(str).str.zfill(5)
melissa_df = melissa_df.drop_duplicates(subset="ZipCode")

# ── Load OC zips already in zips.js (to skip them) ──────────────────────────
frontend_data_dir = BASE_DIR / "frontend" / "src" / "data"
with open(frontend_data_dir / "zips.js") as f:
    raw = f.read()
# Extract keys by parsing the JS object keys
import re
oc_zips = set(re.findall(r'"(\d{5})":', raw))
print(f"OC zips already in zips.js: {len(oc_zips)}")

# ── Build known-zip coord lookup (for haversine) ─────────────────────────────
known_zip_coords = (
    asthma_df[["ZIP", "Latitude", "Longitude"]].copy()
    .dropna(subset=["Latitude", "Longitude"])
    .drop_duplicates(subset="ZIP")
)
known_zip_coords["lat"] = pd.to_numeric(known_zip_coords["Latitude"], errors="coerce")
known_zip_coords["lng"] = pd.to_numeric(known_zip_coords["Longitude"], errors="coerce")
known_zip_coords = known_zip_coords.dropna(subset=["lat", "lng"])

def haversine(lat1, lng1, lat2, lng2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat/2)**2
         + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2))
         * math.sin(dlng/2)**2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def find_nearest_zip(lat, lng):
    coords = known_zip_coords.copy()
    coords["dist"] = coords.apply(lambda r: haversine(lat, lng, r["lat"], r["lng"]), axis=1)
    return coords.loc[coords["dist"].idxmin(), "ZIP"]

# ── Group CES data by ZIP (mean across tracts) ────────────────────────────────
PCTL_COLS = [
    "Tox. Release Pctl", "Low Birth Weight Pctl", "PM2.5 Pctl",
    "Traffic Pctl", "Poverty Pctl", "Education Pctl", "CES 4.0 Percentile",
    "pred_asthma", "pred_cardio",
]
# Keep only columns that exist
pctl_cols_present = [c for c in PCTL_COLS if c in asthma_df.columns]

# Coerce percentile columns to numeric first
for col in pctl_cols_present:
    asthma_df[col] = pd.to_numeric(asthma_df[col], errors="coerce")

# Also need Total Population (sum per zip)
ces_zip_pctl = asthma_df.groupby("ZIP")[pctl_cols_present].mean().reset_index()
ces_zip_pop  = asthma_df.groupby("ZIP")["Total Population"].sum().reset_index()
ces_by_zip   = ces_zip_pctl.merge(ces_zip_pop, on="ZIP", how="left")

# City name: most common "Approximate Location" per zip
if "Approximate Location" in asthma_df.columns:
    ces_city = (
        asthma_df.groupby("ZIP")["Approximate Location"]
        .agg(lambda s: s.mode().iloc[0] if len(s.mode()) > 0 else "")
        .reset_index()
        .rename(columns={"Approximate Location": "city"})
    )
    ces_by_zip = ces_by_zip.merge(ces_city, on="ZIP", how="left")
else:
    ces_by_zip["city"] = ""

ces_by_zip = ces_by_zip.set_index("ZIP")

def safe_scalar(val):
    """Convert a value to float safely, return None if NaN/missing."""
    try:
        f = float(val)
        return round(f, 1) if not math.isnan(f) else None
    except (TypeError, ValueError):
        return None

def safe_int_pop(val):
    try:
        f = float(val)
        return int(f) if not math.isnan(f) else None
    except (TypeError, ValueError):
        return None

# ── Build predictedZips ───────────────────────────────────────────────────────
results = {}
melissa_zips = set(melissa_df["ZipCode"].unique())
target_zips = melissa_zips - oc_zips
print(f"Melissa zips to process: {len(target_zips)}")

for i, zip_code in enumerate(sorted(target_zips)):
    mel_row = melissa_df[melissa_df["ZipCode"] == zip_code]
    if mel_row.empty:
        continue

    try:
        mel = mel_row.iloc[0]
        lat  = float(mel["Latitude"])
        lng  = float(mel["Longitude"])
        city = str(mel["City"]).strip().title()
    except Exception:
        continue

    if zip_code in ces_by_zip.index:
        # ZIP has real CES data (but not OC → not in zips.js)
        row = ces_by_zip.loc[zip_code]
        results[zip_code] = {
            "name":       city or str(row.get("city", "")),
            "score":      safe_scalar(row.get("CES 4.0 Percentile")),
            "asthma":     safe_scalar(row.get("pred_asthma")),
            "cardio":     safe_scalar(row.get("pred_cardio")),
            "toxRelease": safe_scalar(row.get("Tox. Release Pctl")),
            "lowBirth":   safe_scalar(row.get("Low Birth Weight Pctl")),
            "pm25":       safe_scalar(row.get("PM2.5 Pctl")),
            "traffic":    safe_scalar(row.get("Traffic Pctl")),
            "poverty":    safe_scalar(row.get("Poverty Pctl")),
            "education":  safe_scalar(row.get("Education Pctl")),
            "totalPop":   safe_int_pop(row.get("Total Population")),
            "tractCount": "—",
            "hispanic": None, "white": None, "asian": None, "black": None,
            "estimated": True,
        }
    else:
        # ZIP not in CES at all — use nearest zip
        nearest_zip = find_nearest_zip(lat, lng)
        if nearest_zip not in ces_by_zip.index:
            continue
        row = ces_by_zip.loc[nearest_zip]

        nearest_coords = known_zip_coords[known_zip_coords["ZIP"] == nearest_zip]
        if nearest_coords.empty:
            continue
        nc = nearest_coords.iloc[0]
        dist_km = haversine(lat, lng, float(nc["lat"]), float(nc["lng"]))

        nearest_city = ""
        if "city" in row.index:
            nearest_city = str(row["city"]).strip()

        results[zip_code] = {
            "name":       city,
            "score":      safe_scalar(row.get("CES 4.0 Percentile")),
            "asthma":     safe_scalar(row.get("pred_asthma")),
            "cardio":     safe_scalar(row.get("pred_cardio")),
            "toxRelease": safe_scalar(row.get("Tox. Release Pctl")),
            "lowBirth":   safe_scalar(row.get("Low Birth Weight Pctl")),
            "pm25":       safe_scalar(row.get("PM2.5 Pctl")),
            "traffic":    safe_scalar(row.get("Traffic Pctl")),
            "poverty":    safe_scalar(row.get("Poverty Pctl")),
            "education":  safe_scalar(row.get("Education Pctl")),
            "totalPop":   safe_int_pop(row.get("Total Population")),
            "tractCount": "—",
            "hispanic": None, "white": None, "asian": None, "black": None,
            "estimated": True,
            "nearestZip":  nearest_zip,
            "nearestCity": nearest_city,
            "distanceKm":  round(dist_km, 1),
        }

    if (i + 1) % 50 == 0:
        print(f"  processed {i+1}/{len(target_zips)}")

print(f"Generated {len(results)} predicted zips")

# ── Write JS file ─────────────────────────────────────────────────────────────
js = "// Auto-generated predicted ZIP data for non-OC Melissa ZIPs\n"
js += f"// {len(results)} zip codes · Generated by generate_predicted_zips.py\n\n"
js += "const PREDICTED_ZIPS = " + json.dumps(results, indent=2) + "\n\nexport default PREDICTED_ZIPS\n"

out_path = frontend_data_dir / "predictedZips.js"
with open(out_path, "w") as f:
    f.write(js)

print(f"Written to {out_path}")
