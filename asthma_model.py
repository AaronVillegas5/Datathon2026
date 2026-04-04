import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_squared_error
import shap
import math
import joblib  # for saving and loading models

# ---------------------------
# 1️⃣ Load & Clean Data
# ---------------------------
def load_and_clean_data(csv_path):
    df = pd.read_csv(csv_path)
    
    features = ["Total Population", "Traffic", "Ozone", "PM2.5", 
                "Diesel PM", "Drinking Water", "Lead", "Pesticides",
                "Cleanup Sites", "Groundwater Threats", "Haz. Waste",
                "Imp. Water Bodies", "Solid Waste", "Education",
                "Linguistic Isolation", "Unemployment", "Housing Burden"]
    
    df_clean = df.dropna(subset=features + ["Asthma Pctl"])
    
    X = df_clean[features]
    y = df_clean["Asthma Pctl"]
    
    return df_clean, X, y

# ---------------------------
# 2️⃣ Train Model & Save
# ---------------------------
def train_and_save_model(X, y, model_path="best_xgb_model.pkl", random_state=42):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=random_state)
    
    xgb = XGBRegressor(objective="reg:squarederror", random_state=random_state)
    
    param_grid = {
        'n_estimators': [500],
        'max_depth': [4, 5, 6, 7, 10, 12, 15, 20],
        'learning_rate': [0.01, 0.03, 0.05, 0.1],
        'subsample': [0.7, 0.8, 1.0],
        'colsample_bytree': [0.7, 0.8, 1.0]
    }
    
    random_search = RandomizedSearchCV(
        estimator=xgb,
        param_distributions=param_grid,
        n_iter=20,
        scoring='neg_root_mean_squared_error',
        cv=2,
        verbose=1,
        random_state=random_state,
        n_jobs=-1
    )
    
    random_search.fit(X_train, y_train)
    best_model = random_search.best_estimator_
    
    # Save model
    joblib.dump(best_model, model_path)
    
    # Evaluate
    y_pred = best_model.predict(X_test)
    rmse = math.sqrt(mean_squared_error(y_test, y_pred))
    comparison_df = pd.DataFrame({'Actual': y_test, 'Predicted': y_pred})
    
    return best_model, rmse, comparison_df

# ---------------------------
# 3️⃣ Load Saved Model
# ---------------------------
def load_model(model_path="best_xgb_model.pkl"):
    return joblib.load(model_path)

# ---------------------------
# 4️⃣ Predict Asthma Percentiles
# ---------------------------
def predict_full_dataset(df_clean, X, model):
    df_clean = df_clean.copy()
    df_clean['pred_asthma_pctl'] = model.predict(X)
    return df_clean

# ---------------------------
# 5️⃣ Get Top Percentile Neighborhoods
# ---------------------------
def get_top_percentile(df, percentile=90):
    top_df = df[df['pred_asthma_pctl'] >= percentile].copy()
    top_df = top_df.sort_values(by='pred_asthma_pctl', ascending=False)
    return top_df[['ZIP', 'Asthma Pctl', 'pred_asthma_pctl']]

# ---------------------------
# 6️⃣ Get SHAP Feature Importances (Fixed)
# ---------------------------
def get_shap_importance(model, X, max_display=15):
    explainer = shap.Explainer(model, X)
    shap_values = explainer(X)
    
    # Compute mean absolute SHAP value per feature
    shap_df = pd.DataFrame({
        'feature': X.columns,
        'mean_abs_shap': np.abs(shap_values.values).mean(axis=0)
    }).sort_values(by='mean_abs_shap', ascending=False)
    
    return shap_df.head(max_display)
# ---------------------------
# 7️⃣ Example Usage
# ---------------------------
if __name__ == "__main__":
    df_clean, X, y = load_and_clean_data("data.csv")
    
    # Train and save model
    best_model = load_model("best_xgb_model.pkl")
    # best_model, rmse, comparison_df = train_and_save_model(X, y)
    df_clean = predict_full_dataset(df_clean, X, best_model)
    y_test = df_clean['Asthma Pctl']
    y_pred = df_clean['pred_asthma_pctl']
    rmse = math.sqrt(mean_squared_error(y_test, y_pred))
    print("RMSE:", rmse)
    #print(comparison_df.head(10))
    
    # Or load previously saved model
    best_model = load_model("best_xgb_model.pkl")
    
    # Predict for full dataset
    df_pred = predict_full_dataset(df_clean, X, best_model)
    
    # Get top 10% neighborhoods
    top10 = get_top_percentile(df_pred, percentile=90)
    print(top10.head(10))
    
    # Get SHAP feature importances
    shap_importance = get_shap_importance(best_model, X)
    print(shap_importance)