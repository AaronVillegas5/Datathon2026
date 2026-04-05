#To run the file first: pip install pandas scikit-learn xgboost matplotlib joblib

import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import matplotlib.pyplot as plt
import joblib
Features = ["ZIP", "Ozone", "PM2.5", "Diesel PM", "Drinking Water", "Lead", "Pesticides", "Traffic", 
            "Cleanup Sites", "Groundwater Threats", "Haz. Waste", "Imp. Water Bodies", "Solid Waste", 
            "Education", "Linguistic Isolation", "Poverty", "Unemployment", "Housing Burden"]
df = pd.read_csv('Asthma/data.csv')
df.to_csv('Cardiovascular/cardiovascular.csv.csv', index=False)
df = df[["Cardiovascular Disease" ] + Features]
df = df.dropna()

X = df.drop(columns=['Cardiovascular Disease'])
y = df['Cardiovascular Disease']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(X_train.shape, X_test.shape)

model = XGBRegressor(
    n_estimators=500,
    learning_rate=0.03,
    max_depth=7,
    subsample=0.8,
    colsample_bytree=0.8,
    min_child_weight=3,
    random_state=42
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("MAE:", mean_absolute_error(y_test, y_pred))
print("R2 Score:", r2_score(y_test, y_pred))


feature_importance = pd.Series(model.feature_importances_, index=X.columns)
feature_importance.sort_values().plot(kind='barh', figsize=(10, 6))
plt.title('Feature Importance for Cardiovascular Disease Prediction')
plt.tight_layout()
plt.savefig('feature_importance.png')
print(feature_importance.sort_values(ascending=False))

joblib.dump(model, 'cardiovascular_model.pkl')
print("Model saved.")

# Example prediction
sample = X_test.iloc[0]
prediction = model.predict([sample])
print("Actual:", y_test.iloc[0])
print("Predicted:", prediction[0])