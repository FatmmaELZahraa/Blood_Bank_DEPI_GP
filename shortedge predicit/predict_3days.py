import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import holidays
import joblib

# -------------------
# 1️⃣ تحميل الداتا والموديل
# -------------------
df = pd.read_csv("blood_bank_dataset_realistic.csv")

# تحويل blood_type لأرقام (dummy variables)
df_model = pd.get_dummies(df, columns=["blood_type"])

# حفظ التاريخ لفائدة التوقعات
date_cols = ['date'] + [col for col in df_model.columns if col.startswith("blood_type_")]
df_dates = df_model[date_cols]

# حذف التاريخ من الداتا
df_model = df_model.drop("date", axis=1)

# Features و Target
X = df_model.drop("shortage", axis=1)
y = df_model["shortage"]

# تحميل الموديل المتدرب (لو مش موجود هيتم تدريب واحد جديد)
try:
    model = joblib.load('trained_blood_model.pkl')
    print("✅ Loaded trained model!")
except:
    model = RandomForestClassifier()
    model.fit(X, y)
    joblib.dump(model, 'trained_blood_model.pkl')
    print("✅ Model trained and saved!")

# -------------------
# 2️⃣ إعداد توقع لثلاث أيام قدام
# -------------------
last_day = pd.to_datetime(df['date'].max())
blood_type_cols = [col for col in df_model.columns if col.startswith("blood_type_")]

egypt_holidays = holidays.Egypt(years=[2024])
predictions = []

for day_ahead in range(1, 4):
    next_date = last_day + pd.Timedelta(days=day_ahead)
    
    for bt in blood_type_cols:
        # ناخد آخر صف كـ DataFrame بنفس الأعمدة
        last_row = X.iloc[-1].copy()
        
        # تحديث blood_type
        for b in blood_type_cols:
            last_row[b] = 1 if b == bt else 0
        
        # تحديث الوقت
        last_row['is_holiday'] = int(next_date.weekday() >= 4)
        last_row['special_event'] = 1 if next_date in egypt_holidays else 0
        
        # Prediction
        pred = model.predict(pd.DataFrame([last_row], columns=X.columns))[0]
        
        predictions.append({
            "date": next_date.date(),
            "blood_type": bt.replace("blood_type_",""),
            "predicted_shortage": pred
        })

# حفظ النتائج
pred_df = pd.DataFrame(predictions)
pred_df.to_csv("shortage_predictions_3days.csv", index=False)

print("✅ Predictions saved to shortage_predictions_3days.csv")
print(pred_df.head())