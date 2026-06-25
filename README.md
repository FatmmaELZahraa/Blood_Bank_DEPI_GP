# Bank Blood Network 🩸

An integrated management ecosystem featuring donor profile management, real-time hospital inventory tracking, and AI-powered blood analytics to streamline critical operations across blood banks, hospitals, and blood donors.

---

## 🚀 Key Features

### 1. Donor Portal & Engagement
* **Digital Profile & QR ID:** Instant QR code configuration utilizing `qrcode.react` for fast on-site check-in registration.
* **Smart Booking & Eligibility:** Real-time eligibility tracking based on last donation dates and integrated mapping for appointment scheduling.
* **Gamification UI Framework:** Tailored tracking systems for custom points and badges redeemable for health rewards and healthcare partner discounts.

### 2. Inventory & Hospital Management
* **Live Dashboard:** Built-in charts powered by `recharts` for monitoring active blood units by type with low-stock alerts.
* **SOS Requests:** Instant emergency escalation dispatching geo-targeted alerts to local donors for rare blood types.

### 3. Machine Learning & Intelligent Automation
* **Shortage Prediction:** Trend forecasting models to predict inventory dips during holidays or seasonal trends.
* **Smart Donor Matching:** Algorithmic ranking that selects high-probability donors based on proximity and historic responsiveness.
* **Blood Quality Analysis:** Computer Vision model powered by `ultralytics` (YOLOv8) and `opencv-python` assisting in accelerated laboratory sample classification.
* **Voice-Enabled NLP Chatbot:** An intelligent medical inquiry chatbot that answers donor questions regarding eligibility with voice-enabled sound assistance.

---

## 🛠️ System Architecture

The project utilizes a decoupled **3-Tier Architecture**:
* **Frontend:** Built with **Next.js 16** and styled with **Tailwind CSS v4**.
* **Core Backend API:** Engineered using the **.NET (C#)** ecosystem.
* **Machine Learning Microservices:** Powered by **Flask** / Python.
* **Database:** Relational storage using **SQL Server**.

---

## 📦 Project Dependencies

### Frontend (Next.js)
* `next`: `16.1.6`
* `react` / `react-dom`: `19.2.4`
* `tailwindcss` / `@tailwindcss/postcss`: `^4.2.0`
* `lucide-react`: `^0.564.0`
* `qrcode.react`: `^4.2.0`
* `recharts`: `2.15.0`
* `react-hook-form` & `zod`

### Main Backend API (.NET Core)
* `.NET SDK 8.0` or higher
* `Microsoft.EntityFrameworkCore.SqlServer`
* `System.IdentityModel.Tokens.Jwt`

### Machine Learning Engine (Flask & Python)
* `flask` == `3.1.3`
* `ultralytics` == `8.4.33`
* `opencv-python` == `4.13.0.92`
* `torch` == `2.11.0`
* `torchvision` == `0.26.0`

---

## 🏃 Way to Run the Project

Follow these steps to spin up the entire application locally on your machine.

### Prerequisites
* **Node.js** (v18+ or later)
* **.NET SDK** (v8.0+)
* **Python** (3.9+ or later)
* **SQL Server Instance** running locally

---

### Step 1: Database Setup

1. Open your local SQL Server instance.
2. Confirm or create a new database named `BloodBank`.
3. Verify your database connection settings inside your local `appsettings.json` file:

```json
"ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=BloodBank;Trusted_Connection=True;TrustServerCertificate=True;"
}
Step 2: Run the .NET Core Backend API
Open a terminal window and navigate to your core backend repository folder:
cd BloodBank
Restore NuGet packages and apply the structural migrations to your database:
dotnet restore
dotnet ef database update
dotnet run
The main API service will initialize (by default on local web targets like http://localhost:5004
