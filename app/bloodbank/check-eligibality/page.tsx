"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, FileImage, HeartPulse, User, Droplets, TrendingUp 
} from "lucide-react";


interface AnalysisResult {
  analysis: { RBC: number; WBC: number; Platelets: number };
  overall_health: string;
  observations: string[];
}

interface SmartDonorData {
  userId: string;
  Is_Compatible: string;
  Age: string;
  Distance_KM: string;
  Last_Donation_Days: string;
  Historical_Response_Rate: string;
  Blood_Quality_Score: string;
}

interface SmartDonorResult {
  prediction: number | boolean; 
  probability: number;
  status?: string;  
}

export default function IntegratedBloodServicesDashboard() {
  const [mounted, setMounted] = useState(false);

  // --- States: 1. Blood Image Analysis ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // --- States for the Top Donor Promotion form (Right Side) ---
  const [topDonorUserId, setTopDonorUserId] = useState(""); 
  const [upgradeLoading, setUpgradeLoading] = useState(false); 
  const [upgradeStatus, setUpgradeStatus] = useState<{ success: boolean; message: string } | null>(null); 

  // --- States: 3. Smart AI Donor Match ---
  const [smartDonorData, setSmartDonorData] = useState<SmartDonorData>({
    userId: "",
    Is_Compatible: "1",
    Age: "",
    Distance_KM: "",
    Last_Donation_Days: "",
    Historical_Response_Rate: "",
    Blood_Quality_Score: "",
  });
  const [smartDonorResult, setSmartDonorResult] = useState<SmartDonorResult | null>(null);
  const [smartDonorLoading, setSmartDonorLoading] = useState<boolean>(false);
  const [smartDonorError, setSmartDonorError] = useState<string | null>(null);

  // --- States: 4. Shortage Prediction ---
  const [shortageData, setShortageData] = useState({
    bloodType: "A+", availableUnits: "", prevDayStock: "", donatedUnits: "", 
    requestedUnits: "", donorCount: "", hospitalRequests: "", emergencyCases: "",
    isHoliday: "0", specialEvent: "0"
  });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => { setMounted(true); }, []);

  //  Image Analysis
  const handleAnalysis = async () => {
    if (!selectedFile) return setAnalysisError("Please select an image.");
    setAnalysisLoading(true); 
    setAnalysisError(null);
    const formData = new FormData(); 
    formData.append('image', selectedFile);
    try {
      const res = await fetch('http://127.0.0.1:7000/analyze-blood', { method: 'POST', body: formData });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err: any) { 
      setAnalysisError("Server connection failed. Is port 7000 running?"); 
    } finally { 
      setAnalysisLoading(false); 
    }
  };

  //Promote an existing user to Top Donor status 
  const handleMarkAsTopDonor = async () => {
    if (!topDonorUserId) {
      setUpgradeStatus({ success: false, message: "Error: Please enter a User ID." });
      return;
    }

    setUpgradeLoading(true);
    setUpgradeStatus(null);

    try {
      const url = `http://localhost:5004/api/donor/mark-top/${topDonorUserId}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const messageText = await res.text();

      if (res.ok) {
        setUpgradeStatus({ 
          success: true, 
          message: `Success: User ID ${topDonorUserId} is now ${messageText || "Top Donor"}!` 
        });
        setTopDonorUserId(""); 
      } else {
        setUpgradeStatus({ success: false, message: `Failed: ${messageText || "Unknown error."}` });
      }
    } catch (error) {
      console.error("API Connection Error:", error);
      setUpgradeStatus({ success: false, message: "Error: Could not connect to the backend server." });
    } finally {
      setUpgradeLoading(false);
    }
  };
  
  //  Smart AI Donor Match Input Handler 
  const handleSmartDonorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSmartDonorData({ 
      ...smartDonorData, 
      [e.target.name]: e.target.value 
    });
  };

  // Submit Data to Flask AI and Auto-fill the Promotion Card 
  const handleSmartDonorSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSmartDonorLoading(true);
    setSmartDonorError(null);
    setSmartDonorResult(null);

    if (!smartDonorData.userId) {
      setSmartDonorError("Error: Please enter a User ID before running the AI model.");
      setSmartDonorLoading(false);
      return;
    }

    const requestData = {
      Is_Compatible: parseInt(smartDonorData.Is_Compatible),
      Age: parseInt(smartDonorData.Age),
      Distance_KM: parseFloat(smartDonorData.Distance_KM),
      Last_Donation_Days: parseInt(smartDonorData.Last_Donation_Days),
      Historical_Response_Rate: parseFloat(smartDonorData.Historical_Response_Rate),
      Blood_Quality_Score: parseFloat(smartDonorData.Blood_Quality_Score),
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/predict-donor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("Failed to fetch prediction from Samya Model.");
      
      const data: SmartDonorResult = await response.json();
      setSmartDonorResult(data);

      if (data && (data.prediction === true || data.prediction === 1 || data.status === "Eligible")) {
        setTopDonorUserId(smartDonorData.userId); 
      }

    } catch (err: any) {
      setSmartDonorError(err.message || "An error occurred. Is Flask running on port 5000?");
    } finally {
      setSmartDonorLoading(false);
    }
  };

  // --- Functions: 4. Shortage Prediction ---
  const handlePredictShortage = async () => {
    setPredictionLoading(true);

    const bloodTypeArray = [0, 0, 0, 0, 0, 0, 0, 0];
    if (shortageData.bloodType === "A+")   bloodTypeArray[0] = 1;
    if (shortageData.bloodType === "A-")   bloodTypeArray[1] = 1;
    if (shortageData.bloodType === "AB+")  bloodTypeArray[2] = 1;
    if (shortageData.bloodType === "AB-")  bloodTypeArray[3] = 1;
    if (shortageData.bloodType === "B+")   bloodTypeArray[4] = 1;
    if (shortageData.bloodType === "B-")   bloodTypeArray[5] = 1;
    if (shortageData.bloodType === "O+")   bloodTypeArray[6] = 1;
    if (shortageData.bloodType === "O-")   bloodTypeArray[7] = 1;

    const payload = [
      new Date().getMonth() + 1,                     
      Number(shortageData.availableUnits) || 0,      
      Number(shortageData.prevDayStock) || 0,        
      Number(shortageData.donatedUnits) || 0,        
      Number(shortageData.requestedUnits) || 0,      
      Number(shortageData.donorCount) || 0,          
      Number(shortageData.hospitalRequests) || 3,    
      Number(shortageData.emergencyCases) || 0,      
      Number(shortageData.isHoliday) || 0,           
      Number(shortageData.specialEvent) || 0,        
      ...bloodTypeArray                              
    ];

    try {
      const res = await fetch("https://maalaak-blood-shortage-api.hf.space/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setPrediction(result.prediction);
    } catch { 
      console.error("Prediction failed. Is Hugging Face Space running?"); 
    } finally { 
      setPredictionLoading(false); 
    }
  };

  // --- Functions: 5. Send Shortage Alert Emails ---
  const handleSendEmails = async () => {
    setEmailLoading(true);
    setEmailStatus(null);

    try {
      const bloodTypeParam = encodeURIComponent(shortageData.bloodType);
      const url = `http://localhost:5004/api/notification/send-shortage-alert?bloodType=${bloodTypeParam}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const messageText = await res.text();

      if (res.ok) {
        setEmailStatus({ success: true, message: `Success: ${messageText}` });
      } else {
        setEmailStatus({ success: false, message: `Failed: ${messageText}` });
      }
    } catch (error) {
      console.error("Email API Error:", error);
      setEmailStatus({ success: false, message: "Error: Connection failed. Is backend running on port 5004?" });
    } finally {
      setEmailLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto py-10 px-4 space-y-10 bg-gray-50 min-h-screen rounded-xl">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-black text-red-600 flex justify-center items-center gap-3">
          <Droplets size={40} /> BLOOD BANK AI COMMAND
        </h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold">Integrated Healthcare Management System</p>
      </header>

      {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* SECTION 1: IMAGE ANALYSIS */}
        <Card className="shadow-lg border-t-4 border-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileImage className="text-red-500"/> Cell Analysis</CardTitle>
            <CardDescription>Upload microscopic slide image </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-xl p-6 text-center bg-slate-50">
              <input type="file" className="hidden" id="blood-upload" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
              <label htmlFor="blood-upload" className="cursor-pointer">
                <Upload className="mx-auto mb-2 text-slate-400" />
                <p className="text-xs font-bold">{selectedFile ? selectedFile.name : "Choose Image"}</p>
              </label>
            </div>
            <Button onClick={handleAnalysis} disabled={analysisLoading} className="w-full bg-red-600 hover:bg-red-700">
              {analysisLoading ? "Analyzing..." : "Analyze Slide"}
            </Button>
            {analysisError && <p className="text-red-500 text-sm text-center font-semibold">{analysisError}</p>}
            {analysisResult && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm animate-in fade-in">
                <div className="flex justify-between mb-2 font-bold">
                  <span>Status: {analysisResult.overall_health}</span>
                  <Badge variant={analysisResult.overall_health === "Normal" ? "default" : "destructive"}>Model Checked</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">RBC: {analysisResult.analysis.RBC} | WBC: {analysisResult.analysis.WBC} | PLT: {analysisResult.analysis.Platelets}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION 3: SMART AI DONOR MATCH - الأخضر القديم */}
        <Card className="shadow-lg border-t-4 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HeartPulse className="text-green-500"/> AI Donor Match</CardTitle>
            <CardDescription>Predict likelihood of donation </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSmartDonorSubmit} className="space-y-4">
              
              {/* Target Donor User ID */}
              <div className="space-y-1">
                <Label htmlFor="smart-user-id" className="text-sm font-semibold text-gray-700">Target Donor User ID</Label>
                <Input 
                  id="smart-user-id"
                  name="userId"
                  type="number" 
                  placeholder="Enter ID to test (e.g., 5)" 
                  value={smartDonorData.userId} 
                  onChange={handleSmartDonorChange}
                  className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              {/* Grid System for AI Features */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Is Compatible?</Label>
                  <select name="Is_Compatible" value={smartDonorData.Is_Compatible} onChange={handleSmartDonorChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="1">Yes (1)</option>
                    <option value="0">No (0)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Age</Label>
                  <Input type="number" name="Age" value={smartDonorData.Age} onChange={handleSmartDonorChange} placeholder="e.g., 30" required />
                </div>
                <div className="space-y-1">
                  <Label>Distance (KM)</Label>
                  <Input type="number" step="0.1" name="Distance_KM" value={smartDonorData.Distance_KM} onChange={handleSmartDonorChange} placeholder="e.g., 5.5" required />
                </div>
                <div className="space-y-1">
                  <Label>Days Since Last</Label>
                  <Input type="number" name="Last_Donation_Days" value={smartDonorData.Last_Donation_Days} onChange={handleSmartDonorChange} placeholder="e.g., 120" required />
                </div>
                <div className="space-y-1">
                  <Label>Response Rate</Label>
                  <Input type="number" step="0.01" name="Historical_Response_Rate" value={smartDonorData.Historical_Response_Rate} onChange={handleSmartDonorChange} placeholder="e.g., 0.85" required />
                </div>
                <div className="space-y-1">
                  <Label>Quality Score</Label>
                  <Input type="number" step="0.1" name="Blood_Quality_Score" value={smartDonorData.Blood_Quality_Score} onChange={handleSmartDonorChange} placeholder="e.g., 9.2" required />
                </div>
              </div>
              
              <Button type="submit" disabled={smartDonorLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                {smartDonorLoading ? "Predicting..." : "Predict Match"}
              </Button>
            </form>

            {smartDonorError && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">{smartDonorError}</div>
            )}

            {smartDonorResult && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-gray-800">
                <p className="mb-1">
                  <strong>Match:</strong>{" "}
                  {smartDonorResult.prediction === 1 || smartDonorResult.prediction === true ? (
                    <span className="text-green-600 font-bold">Likely to Donate</span>
                  ) : (
                    <span className="text-red-600 font-bold">Unlikely to Donate</span>
                  )}
                </p>
                <p>
                  <strong>Confidence:</strong>{" "}
                  <span className="font-bold">{(smartDonorResult.probability * 100).toFixed(2)}%</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION 4: SHORTAGE PREDICTION */}
        <Card className="shadow-lg border-t-4 border-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp /> Shortage Forecast</CardTitle>
            <CardDescription>AI Prediction based on supply & demand</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Available Units" type="number" onChange={(e)=>setShortageData({...shortageData, availableUnits: e.target.value})} />
                <Input placeholder="Prev Day Stock" type="number" onChange={(e)=>setShortageData({...shortageData, prevDayStock: e.target.value})} />
                <Input placeholder="Donated Units" type="number" onChange={(e)=>setShortageData({...shortageData, donatedUnits: e.target.value})} />
                <Input placeholder="Requested Units" type="number" onChange={(e)=>setShortageData({...shortageData, requestedUnits: e.target.value})} />
                <Input placeholder="Donor Count" type="number" onChange={(e)=>setShortageData({...shortageData, donorCount: e.target.value})} />
                <Input placeholder="Emergency Cases" type="number" onChange={(e)=>setShortageData({...shortageData, emergencyCases: e.target.value})} />
             </div>
             
             <div className="grid grid-cols-3 gap-2">
               <Select value={shortageData.bloodType} onValueChange={(v)=>setShortageData({...shortageData, bloodType: v})}>
                 <SelectTrigger className="text-sm"><SelectValue placeholder="Blood Type" /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="A+">A+</SelectItem>
                   <SelectItem value="A-">A-</SelectItem>
                   <SelectItem value="AB+">AB+</SelectItem>
                   <SelectItem value="AB-">AB-</SelectItem>
                   <SelectItem value="B+">B+</SelectItem>
                   <SelectItem value="B-">B-</SelectItem>
                   <SelectItem value="O+">O+</SelectItem>
                   <SelectItem value="O-">O-</SelectItem>
                 </SelectContent>
               </Select>

               <Select value={shortageData.isHoliday} onValueChange={(v)=>setShortageData({...shortageData, isHoliday: v})}>
                 <SelectTrigger className="text-sm"><SelectValue placeholder="Holiday?" /></SelectTrigger>
                 <SelectContent><SelectItem value="0">Work Day</SelectItem><SelectItem value="1">Holiday</SelectItem></SelectContent>
               </Select>

               <Select value={shortageData.specialEvent} onValueChange={(v)=>setShortageData({...shortageData, specialEvent: v})}>
                 <SelectTrigger className="text-sm"><SelectValue placeholder="Event?" /></SelectTrigger>
                 <SelectContent><SelectItem value="0">Normal</SelectItem><SelectItem value="1">Special Event</SelectItem></SelectContent>
               </Select>
             </div>

             <Button onClick={handlePredictShortage} disabled={predictionLoading} className="w-full bg-black text-white hover:bg-gray-800">
                {predictionLoading ? "Predicting..." : "Predict Shortage Risk"}
             </Button>

             {prediction !== null && (
               <div className={`p-4 rounded-xl border-2 text-center font-black animate-bounce mt-2 ${prediction === 1 ? "bg-red-600 text-white border-red-800" : "bg-green-600 text-white border-green-800"}`}>
                  {prediction === 1 ? "⚠️ CRITICAL SHORTAGE" : "✅ STABLE SUPPLY"}
               </div>
             )}

<Button 
  onClick={handleSendEmails} 
  disabled={emailLoading}
  className="group relative w-full mt-2 h-11 bg-white hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 text-slate-900 font-black tracking-wider flex items-center justify-center gap-2 border-2 border-black shadow-sm transition-all active:scale-[0.98] overflow-hidden"
>
  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <Droplets size={24} className="absolute left-4 top-1 text-red-600/80 animate-bounce" />
    <Droplets size={14} className="absolute left-16 bottom-2 text-red-500 animate-pulse" />
    <Droplets size={18} className="absolute left-28 top-2 text-red-600" />
    <Droplets size={12} className="absolute right-24 bottom-1 text-red-500 animate-bounce" />
    <Droplets size={20} className="absolute right-12 top-2 text-red-600 animate-pulse" />
    <Droplets size={16} className="absolute right-4 bottom-2 text-red-500" />
  </div>

  <span className="relative z-10 flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
    <Droplets size={18} className="text-red-600 animate-pulse" />
    {emailLoading ? "Sending Emails..." : `Send Emails to Top Donors (${shortageData.bloodType})`}
    <Droplets size={18} className="text-red-600 animate-pulse" />
  </span>
</Button>



              {emailStatus && (
                <div className={`p-3 rounded-lg text-center font-bold text-xs mt-2 border ${emailStatus.success ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                  {emailStatus.message}
                </div>
              )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-red-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700"><User className="text-red-700"/> Promotion Panel</CardTitle>
            <CardDescription>After Checking AI Donor Match</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="top-donor-id" className="text-sm font-semibold text-gray-700">Promotion Control</Label>
              <Input 
                id="top-donor-id"
                type="number" 
                placeholder="Enter Donor User ID (e.g. 5)" 
                value={topDonorUserId} 
                onChange={(e) => setTopDonorUserId(e.target.value)}
                className="w-full border-gray-300 focus:border-red-700 focus:ring-red-700"
              />
              <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                Enter the ID of the donor predicted by the AI model to grant them "Top Donor" priority.
              </p>
            </div>
           
            <Button 
              onClick={handleMarkAsTopDonor} 
              disabled={upgradeLoading}
              className="w-full bg-red-700 hover:bg-red-800 text-white font-bold transition-all shadow-md active:scale-95"
            >
              {upgradeLoading ? "Processing..." : "Promote to Top Donor"}
            </Button>

            {upgradeStatus && (
              <div className={`p-3 rounded-lg text-center font-bold text-xs mt-2 border-2 ${upgradeStatus.success ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                {upgradeStatus.message}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 space-y-3 text-left">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
                Admin Quick Guide
              </span>
              <ul className="space-y-2 text-xs text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="text-red-700 font-bold">1.</span>
                  <span>Run the <strong>Smart AI Donor Match</strong> model in the center card first.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-700 font-bold">2.</span>
                  <span>If the prediction returns <strong>True</strong>, the system will automatically copy the donor's ID.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-700 font-bold">3.</span>
                  <span>Click promote above to ensure they receive emergency notifications from the .NET system.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}