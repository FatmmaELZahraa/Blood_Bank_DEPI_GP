import pandas as pd
import numpy as np
import holidays

# عدد الأيام
days = 365

blood_types = ["A+","A-","B+","B-","AB+","AB-","O+","O-"]

# التواريخ (هتتكرر لكل فصيلة)
dates = pd.date_range(start="2024-01-01", periods=days, freq="D")

# عمل DataFrame فيه كل يوم × كل فصيلة
df = pd.DataFrame([
    (date, bt) for date in dates for bt in blood_types
], columns=["date", "blood_type"])

# مميزات الوقت
df["month"] = df["date"].dt.month
df["is_holiday"] = (df["date"].dt.weekday >= 4).astype(int)

# الإجازات الرسمية
egypt_holidays = holidays.Egypt(years=[2024])
df["special_event"] = df["date"].apply(lambda x: 1 if x in egypt_holidays else 0)

# عدد المتبرعين
df["donor_count"] = np.random.randint(10, 50, len(df))

# تقليل المتبرعين في المناسبات
mask = df["special_event"] == 1
df.loc[mask, "donor_count"] = np.random.randint(1, 10, mask.sum())

# التبرعات
df["donated_units"] = df["donor_count"] + np.random.randint(0, 5, len(df))

# الحالات الطارئة
df["emergency_cases"] = np.random.randint(0, 20, len(df))

# الطلب (متأثر بالطوارئ)
df["requested_units"] = np.random.randint(10, 80, len(df)) + df["emergency_cases"]

# عدد المستشفيات
df["hospital_requests"] = np.random.randint(1, 10, len(df))

# مخزون اليوم السابق
df["previous_day_stock"] = np.random.randint(20, 100, len(df))

# حساب المخزون الحالي بشكل منطقي
df["available_units"] = (
    df["previous_day_stock"] + df["donated_units"] - df["requested_units"]
)

df["available_units"] = df["available_units"].clip(lower=0)

# تحديد النقص
df["shortage"] = (df["requested_units"] > df["available_units"]).astype(int)

# ترتيب الأعمدة
df = df[
    [
        "date",
        "month",
        "blood_type",
        "available_units",
        "previous_day_stock",
        "donated_units",
        "requested_units",
        "donor_count",
        "hospital_requests",
        "emergency_cases",
        "is_holiday",
        "special_event",
        "shortage",
    ]
]

# حفظ الملف
df.to_csv("blood_bank_dataset_realistic.csv", index=False)

print(df.head())
print("\nShape:", df.shape)