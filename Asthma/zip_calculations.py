import pandas as pd
import numpy as np

# Sensor data
sensors = pd.read_csv("sensor_data.csv")  # columns: lat, lon, pm25

# Melissa ZIP centroids
zipcodes = pd.read_csv("melissa_zip.csv")  # columns: ZIP, Latitude, Longitude

# Function to compute Haversine distance
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # km
    phi1, phi2 = np.radians(lat1), np.radians(lat2)
    dphi = phi2 - phi1
    dlambda = np.radians(lon2 - lon1)
    a = np.sin(dphi/2)**2 + np.cos(phi1)*np.cos(phi2)*np.sin(dlambda/2)**2
    return R * 2 * np.arcsin(np.sqrt(a))

# Map sensors to closest ZIP centroid
def map_sensors_to_zip(sensors, zipcodes):
    zip_lats = zipcodes['Latitude'].values
    zip_lons = zipcodes['Longitude'].values
    zip_codes = zipcodes['ZIP'].values

    assigned_zips = []
    for idx, sensor in sensors.iterrows():
        dists = haversine(sensor['lat'], sensor['lon'], zip_lats, zip_lons)
        assigned_zips.append(zip_codes[np.argmin(dists)])
    sensors['ZIP'] = assigned_zips
    return sensors

sensors = map_sensors_to_zip(sensors, zipcodes)
print(sensors.head())