import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
np.random.seed(42)
num_donors = 1500  # Increased slightly for better training
blood_types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
required_blood_type = 'O+'  # Emergency case

# Blood Compatibility Matrix (Smart Medical Logic)
compatibility = {
    'O+': ['O+', 'O-'],
    'O-': ['O-'],
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['AB-', 'A-', 'B-', 'O-']
}

compatible_list = compatibility.get(required_blood_type, [])

data = {
    'Donor_ID': range(1, num_donors + 1),
    'Blood_Type': np.random.choice(blood_types, num_donors),
    'Age': np.random.randint(18, 65, num_donors),
    'Distance_KM': np.random.uniform(1, 50, num_donors),
    'Last_Donation_Days': np.random.randint(10, 365, num_donors),
    'Historical_Response_Rate': np.round(np.random.uniform(0, 1, num_donors), 2),
    'Blood_Quality_Score': np.round(np.random.uniform(5, 10, num_donors), 2),
}

df = pd.DataFrame(data)

# ================================
# Rule-Based Score
# ================================
def calculate_score(row):
    # Medical hard constraints
    if row['Last_Donation_Days'] < 90 or row['Age'] > 60:
        return 0
    # Use medical compatibility instead of exact strict match
    if row['Blood_Type'] not in compatible_list:
        return 0

    score = 0
    score += (50 - row['Distance_KM']) * 1.5
    score += row['Historical_Response_Rate'] * 25
    score += row['Blood_Quality_Score'] * 20
    if 25 <= row['Age'] <= 45:
        score += 10
    return round(score, 2)

df['Score'] = df.apply(calculate_score, axis=1)
df['Is_Best_Match'] = (df['Score'] > 70).astype(int)

print("✅ Dataset created with Score and Is_Best_Match")
# Replaced LabelEncoder with a smarter 'Is_Compatible' feature
df['Is_Compatible'] = df['Blood_Type'].apply(lambda x: 1 if x in compatible_list else 0)

features = ['Is_Compatible', 'Age', 'Distance_KM', 'Last_Donation_Days', 'Historical_Response_Rate', 'Blood_Quality_Score']
X = df[features]
y = df['Is_Best_Match']

print("✅ Preprocessing done. Features and Target ready")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Random Forest Model
# Random Forest Model
model = RandomForestClassifier(n_estimators=100, random_state=42)

# ✅ تدريب الموديل
model.fit(X_train, y_train)

# ✅ حفظ الموديل بعد التدريب
joblib.dump(model, 'smart_blood_model.pkl')


print("✅ Model trained and saved successfully")
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"🎯 Accuracy: {accuracy*100:.2f}%")
print("\n📝 Classification Report:")
print(classification_report(y_test, y_pred))

cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(6,4))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title("Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.show()
feat_importances = pd.Series(model.feature_importances_, index=X.columns)
feat_importances.sort_values().plot(kind='barh', figsize=(8,6), color='teal')
plt.title("Feature Importance")
plt.xlabel("Importance Score")
plt.ylabel("Feature")
plt.show()
df['Predicted_Prob'] = model.predict_proba(X)[:,1]
top_donors = df.sort_values('Predicted_Prob', ascending=False).head(10)

print("\n🏆 Top 10 Donors:")
print(top_donors[['Donor_ID','Blood_Type','Predicted_Prob','Score']])
# Define new donor characteristics
new_blood_type = 'O+'
is_compatible_val = 1 if new_blood_type in compatible_list else 0

new_donor = pd.DataFrame({
    'Is_Compatible': [is_compatible_val],
    'Age': [30],
    'Distance_KM': [5],
    'Last_Donation_Days': [120],
    'Historical_Response_Rate': [1.00],
    'Blood_Quality_Score': [9.5]
})

# Load the saved model to test it
loaded_model = joblib.load('smart_blood_model.pkl')

prediction = loaded_model.predict(new_donor)
probability = loaded_model.predict_proba(new_donor)

print("\n🤖 Testing New Donor Prediction:")
if prediction[0] == 1:
    print(f"✅ Ideal Donor! (Probability: {probability[0][1]*100:.2f}%)")
else:
  print(f"❌ Donor is not suitable currently (Probability: {probability[0][0]*100:.2f}%)")