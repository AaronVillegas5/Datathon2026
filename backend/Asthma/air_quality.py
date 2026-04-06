import pandas as pd
import geopandas as gpd
import numpy as np
from pathlib import Path
from scipy.spatial import cKDTree
import requests
import os
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[1]
BASE_DIR = BACKEND_DIR.parent
DATA_DIR = BASE_DIR / "data"

# ---------------------------
# Load API key
# ---------------------------
load_dotenv()
API_KEY = os.getenv("PURPLEAIR_API_KEY")
if API_KEY is None:
    raise ValueError("PurpleAir API key not found! Check your .env file.")

# ---------------------------
# 1️⃣ Load Melissa ZIP code dataset
# ---------------------------
melissa_df = pd.read_csv(DATA_DIR / "Melissa_zipcodes.csv")
melissa_df = melissa_df[['ZipCode', 'Latitude', 'Longitude']]

# Only Orange County ZIPs
# You can filter by your asthma dataset later too
# Convert to GeoDataFrame
melissa_gdf = gpd.GeoDataFrame(
    melissa_df,
    geometry=gpd.points_from_xy(melissa_df.Longitude, melissa_df.Latitude),
    crs="EPSG:4326"
)

# ---------------------------
# 2️⃣ Pull PurpleAir sensor data (Orange County)
# ---------------------------
min_lat, max_lat = 33.40, 33.95
min_lon, max_lon = -117.95, -117.55

url = (
    f"https://api.purpleair.com/v1/sensors?"
    f"fields=sensor_index,latitude,longitude,pm2.5"
    f"&nwlat={max_lat}&selat={min_lat}&nwlng={min_lon}&selng={max_lon}"
)

headers = {"X-API-Key": API_KEY}
response = requests.get(url, headers=headers)
data = response.json()

sensors_df = pd.DataFrame(data['data'], columns=data['fields'])
sensors_df = sensors_df[['sensor_index','latitude','longitude','pm2.5']].dropna()

# ---------------------------
# 3️⃣ Map each ZIP to nearest sensor
# ---------------------------
sensor_coords = np.array(list(zip(sensors_df['longitude'], sensors_df['latitude'])))
zip_coords = np.array(list(zip(melissa_gdf['Longitude'], melissa_gdf['Latitude'])))

tree = cKDTree(sensor_coords)
distances, indices = tree.query(zip_coords)  # query nearest sensor for each ZIP

# Assign PM2.5 to each ZIP
melissa_gdf['avg_pm25'] = sensors_df.iloc[indices]['pm2.5'].values

# ---------------------------
# 4️⃣ Merge with asthma dataset (Orange County only)
# ---------------------------
asthma_df = pd.read_csv(DATA_DIR / "data.csv")
asthma_df = asthma_df[asthma_df['California County'] == 'Orange County'].copy()
asthma_df['ZIP'] = asthma_df['ZIP'].astype(str).str.zfill(5)
melissa_gdf['ZipCode'] = melissa_gdf['ZipCode'].astype(str).str.zfill(5)

asthma_df = asthma_df.merge(
    melissa_gdf[['ZipCode','avg_pm25']],
    left_on='ZIP',
    right_on='ZipCode',
    how='left'
)

print(asthma_df[['ZIP','avg_pm25']].head(10))

missing = asthma_df[asthma_df['avg_pm25'].isna()]
print("Missing ZIPs:", missing['ZIP'].unique())
