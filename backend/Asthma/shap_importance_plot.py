import matplotlib.pyplot as plt

features = ["Education","Lead","PM2.5","Ozone","Unemployment","Linguistic Isolation",
            "Drinking Water","Traffic","Diesel PM","Groundwater Threats",
            "Housing Burden","Total Population","Imp. Water Bodies","Cleanup Sites","Haz. Waste"]

mean_abs_shap = [10.096,4.423,4.177,3.164,2.872,2.860,2.495,1.549,1.291,1.178,1.153,1.065,0.989,0.902,0.775]

plt.figure(figsize=(14,6))
plt.barh(features[::-1], mean_abs_shap[::-1])
plt.xlabel("Mean Absolute SHAP Value for Asthma Prediction")
plt.title("Feature Importance from SHAP")
plt.show()