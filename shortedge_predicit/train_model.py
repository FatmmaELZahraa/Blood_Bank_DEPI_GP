# ==============================
# train_model.py - Updated Version
# ==============================

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

# -------------------
# 1️⃣ Load Dataset
# -------------------
df = pd.read_csv("blood_bank_dataset_realistic.csv")

# One-hot encoding for blood types
df = pd.get_dummies(df, columns=["blood_type"])

# Drop date column for training
df_model = df.drop("date", axis=1)

# Features and Target
X = df_model.drop("shortage", axis=1)
y = df_model["shortage"]

# -------------------
# 2️⃣ Train/Test Split
# -------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -------------------
# 3️⃣ Random Forest Training
# -------------------
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, "blood_shortage_model.pkl")
print("✅ Model trained and saved successfully")

# -------------------
# 4️⃣ Evaluation
# -------------------
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\n🎯 Accuracy: {accuracy*100:.2f}%\n")

print("📝 Classification Report:")
print(classification_report(y_test, y_pred))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(6,4))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.title("Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.show()

# -------------------
# 5️⃣ Feature Importance
# -------------------
feat_importances = pd.Series(model.feature_importances_, index=X.columns)
feat_importances.sort_values().plot(kind='barh', figsize=(8,6), color='teal')
plt.title("Feature Importance")
plt.xlabel("Importance Score")
plt.ylabel("Feature")
plt.show()