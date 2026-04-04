import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import shap
import math
import joblib  # for saving/loading models

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
    # Split into train/test properly
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=random_state)
    
    xgb = XGBRegressor(objective="reg:squarederror", random_state=random_state)
    
    param_grid = {
        'n_estimators': [500, 1000],
        'max_depth': [4, 5, 6, 7, 10,20,25],
        'learning_rate': [0.01, 0.03, 0.05, 0.1],
        'subsample': [0.7, 0.8, 1.0],
        'colsample_bytree': [0.7, 0.8, 1.0],
        'gamma': [0, 0.1, 0.2],
        'min_child_weight': [1, 3, 5],
        'tree_method': ['hist']  # Use 'hist' for faster training on larger datasets
    }
    
    random_search = RandomizedSearchCV(
        estimator=xgb,
        param_distributions=param_grid,
        n_iter=20,
        scoring='neg_root_mean_squared_error',
        cv=3,
        verbose=1,
        random_state=random_state,
        n_jobs=-1
    )
    
    random_search.fit(X_train, y_train)
    best_model = random_search.best_estimator_
    
    # Save the best model
    joblib.dump(best_model, model_path)
    
    # Evaluate on holdout set
    y_pred_test = best_model.predict(X_test)
    rmse_test = math.sqrt(mean_squared_error(y_test, y_pred_test))
    comparison_df = pd.DataFrame({'Actual': y_test, 'Predicted': y_pred_test})
    
    return best_model, rmse_test, comparison_df

# ---------------------------
# 3️⃣ Load Saved Model
# ---------------------------
def load_model(model_path="best_xgb_model.pkl"):
    return joblib.load(model_path)

# ---------------------------
# 4️⃣ Predict Asthma Percentiles for Full Dataset
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
# 6️⃣ Get SHAP Feature Importances
# ---------------------------
def get_shap_importance(model, X, max_display=15):
    explainer = shap.Explainer(model, X)
    shap_values = explainer(X)
    
    # Mean absolute SHAP value per feature
    shap_df = pd.DataFrame({
        'feature': X.columns,
        'mean_abs_shap': np.abs(shap_values.values).mean(axis=0)
    }).sort_values(by='mean_abs_shap', ascending=False)
    
    return shap_df.head(max_display)

# ---------------------------
# 7️⃣ Main Example Usage
# ---------------------------
if __name__ == "__main__":
    # 1. Load data
    df_clean, X, y = load_and_clean_data("Asthma\data.csv")
    
    # 2. Train model or load existing
    best_model, rmse, comparison_df = train_and_save_model(X, y)
    # best_model = load_model("Asthma\best_xgb_model.pkl")
    print(f"Test RMSE: {rmse:.4f}")
    y_pred_test = best_model.predict(X)
    print(f"Test R2: {r2_score(y,y_pred_test):.4f}")
    print("Best Hyperparameters:")
    print(best_model.get_params())
    
    # 3. Evaluate RMSE on holdout set if you have train/test split
    # (Use RandomizedSearchCV's internal CV score if not splitting here)
    
    # 4. Predict full dataset
    df_pred = predict_full_dataset(df_clean, X, best_model)
    
    # 5. Get top 10% risk neighborhoods
    top10 = get_top_percentile(df_pred, percentile=90)
    print("Top 10% Asthma Risk Neighborhoods:")
    print(top10.head(10))
    
    # 6. Get SHAP feature importances
    shap_importance = get_shap_importance(best_model, X)
    print("\nTop SHAP Feature Importances:")
    print(shap_importance)