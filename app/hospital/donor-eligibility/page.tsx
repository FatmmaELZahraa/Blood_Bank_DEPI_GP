// // "use client"

// // import { useState } from "react"
// // import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// // import { Input } from "@/components/ui/input"
// // import { Button } from "@/components/ui/button"
// // import { Label } from "@/components/ui/label"
// // import { Badge } from "@/components/ui/badge"
// // import { 
// //   Upload, FileImage, Activity, AlertCircle, CheckCircle2, 
// //   HeartPulse, Weight, User, ArrowRightLeft 
// // } from "lucide-react"

// // interface AnalysisResult {
// //   status: string;
// //   analysis: {
// //     RBC: number;
// //     WBC: number;
// //     Platelets: number;
// //   };
// //   overall_health: string;
// //   observations: string[];
// //   message: string;
// // }

// // export default function BloodServicesPage() {
// //   // --- States لمكون تحليل الصور ---
// //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
// //   const [analysisLoading, setAnalysisLoading] = useState(false);
// //   const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
// //   const [analysisError, setAnalysisError] = useState<string | null>(null);

// //   // --- States لمكون أهلية المتبرع ---
// //   const [age, setAge] = useState("")
// //   const [weight, setWeight] = useState("")
// //   const [chronic, setChronic] = useState(false)
// //   const [eligibilityResult, setEligibilityResult] = useState<null | { status: string; message: string }>(null)

// //   // --- وظيفة تحليل الصورة ---
// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files && e.target.files[0]) {
// //       setSelectedFile(e.target.files[0]);
// //       setAnalysisError(null);
// //     }
// //   };

// //   const uploadAndAnalyze = async () => {
// //     if (!selectedFile) {
// //       setAnalysisError("Please select an image first.");
// //       return;
// //     }
// //     setAnalysisLoading(true);
// //     setAnalysisError(null);
// //     const formData = new FormData();
// //     formData.append('image', selectedFile);

// //     try {
// //       const response = await fetch('http://127.0.0.1:5000/analyze-blood', {
// //         method: 'POST',
// //         body: formData,
// //       });
// //       if (!response.ok) throw new Error("Failed to analyze image");
// //       const data: AnalysisResult = await response.json();
// //       setAnalysisResult(data);
// //     } catch (err) {
// //       setAnalysisError("Could not connect to the server. Make sure Flask is running.");
// //     } finally {
// //       setAnalysisLoading(false);
// //     }
// //   };

// //   const checkEligibility = () => {
// //     if (!age || !weight) {
// //       setEligibilityResult({ status: "Rejected", message: "Please fill in all fields." })
// //       return
// //     }
// //     if (parseInt(age) < 18) {
// //       setEligibilityResult({ status: "Rejected", message: "Age must be at least 18." })
// //       return
// //     }
// //     if (parseInt(weight) < 50) {
// //       setEligibilityResult({ status: "Rejected", message: "Weight must be at least 50 kg." })
// //       return
// //     }
// //     if (chronic) {
// //       setEligibilityResult({ status: "Rejected", message: "Chronic diseases are not allowed." })
// //       return
// //     }
// //     setEligibilityResult({ status: "Accepted", message: "You are eligible to donate blood ✅" })
// //   }

// //   return (
// //     <div className="container mx-auto py-10 px-4 space-y-12">
      
// //       <div className="text-center space-y-2">
// //         <h1 className="text-4xl font-extrabold tracking-tight">Blood Services Dashboard</h1>
// //         <p className="text-muted-foreground text-lg">Manage blood analysis and donor eligibility in one place.</p>
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
// //         <Card className="shadow-xl border-t-4 border-t-red-600 h-full">
// //           <CardHeader>
// //             <div className="flex items-center gap-3 mb-2">
// //               <Activity className="h-6 w-6 text-red-600" />
// //               <CardTitle>AI Blood Cell Analysis</CardTitle>
// //             </div>
// //             <CardDescription>Upload microscopic image to count RBC, WBC, and Platelets</CardDescription>
// //           </CardHeader>
// //           <CardContent className="space-y-6">
// //             <div className="flex items-center justify-center w-full">
// //               <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
// //                 <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
// //                   <Upload className="w-8 h-8 mb-3 text-slate-400" />
// //                   <p className="text-sm text-slate-600">
// //                     {selectedFile ? <span className="font-bold text-red-600">{selectedFile.name}</span> : "Click to upload blood smear"}
// //                   </p>
// //                 </div>
// //                 <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
// //               </label>
// //             </div>

// //             <Button onClick={uploadAndAnalyze} disabled={analysisLoading || !selectedFile} className="w-full">
// //               {analysisLoading ? "Processing..." : "Blood Analysis"}
// //             </Button>

// //             {analysisError && (
// //               <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md flex gap-2">
// //                 <AlertCircle className="h-4 w-4" /> {analysisError}
// //               </div>
// //             )}

// //             {analysisResult && (
// //               <div className="p-4 bg-slate-50 rounded-xl border space-y-4 animate-in fade-in">
// //                 <div className="flex justify-between items-center">
// //                   <span className="text-sm font-bold uppercase tracking-wider">Results:</span>
// //                   <Badge variant={analysisResult.overall_health === "Normal" ? "default" : "destructive"}>
// //                     {analysisResult.overall_health}
// //                   </Badge>
// //                 </div>
// //                 <div className="grid grid-cols-3 gap-2 text-center">
// //                   <div className="bg-white p-2 rounded shadow-sm border"><p className="text-[10px] text-muted-foreground">RBC</p><p className="font-bold">{analysisResult.analysis.RBC}</p></div>
// //                   <div className="bg-white p-2 rounded shadow-sm border"><p className="text-[10px] text-muted-foreground">WBC</p><p className="font-bold">{analysisResult.analysis.WBC}</p></div>
// //                   <div className="bg-white p-2 rounded shadow-sm border"><p className="text-[10px] text-muted-foreground">PLT</p><p className="font-bold">{analysisResult.analysis.Platelets}</p></div>
// //                 </div>
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>

// //         {/* --- المكون الثاني: التأكد من أهلية المتبرع --- */}
// //         <Card className="shadow-xl border-t-4 border-t-blue-600 h-full">
// //           <CardHeader>
// //             <div className="flex items-center gap-3 mb-2">
// //               <User className="h-6 w-6 text-blue-600" />
// //               <CardTitle>Donor Eligibility Check</CardTitle>
// //             </div>
// //             <CardDescription>Enter physical details to confirm donation eligibility</CardDescription>
// //           </CardHeader>
// //           <CardContent className="space-y-5">
// //             <div className="space-y-2">
// //               <Label className="flex items-center gap-2"><User className="h-4 w-4" /> Age</Label>
// //               <Input type="number" placeholder="Min 18 years" value={age} onChange={(e) => setAge(e.target.value)} />
// //             </div>
// //             <div className="space-y-2">
// //               <Label className="flex items-center gap-2"><Weight className="h-4 w-4" /> Weight (kg)</Label>
// //               <Input type="number" placeholder="Min 50 kg" value={weight} onChange={(e) => setWeight(e.target.value)} />
// //             </div>
// //             <div className="flex items-center gap-3 rounded-lg border p-3 bg-slate-50">
// //               <input type="checkbox" checked={chronic} onChange={() => setChronic(!chronic)} className="h-4 w-4" id="chronic" />
// //               <Label htmlFor="chronic" className="flex items-center gap-2 cursor-pointer text-sm">
// //                 <HeartPulse className="h-4 w-4 text-red-500" /> Do you have chronic diseases?
// //               </Label>
// //             </div>

// //             <Button onClick={checkEligibility} variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
// //               Check Eligibility
// //             </Button>

// //             {eligibilityResult && (
// //               <div className="text-center p-4 border-t animate-in slide-in-from-bottom-2">
// //                 <Badge variant={eligibilityResult.status === "Accepted" ? "default" : "destructive"} className="mb-2">
// //                   {eligibilityResult.status}
// //                 </Badge>
// //                 <p className="text-sm text-muted-foreground">{eligibilityResult.message}</p>
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>

// //       </div>
// //     </div>
// //   )
// // }

// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Droplets, Activity, Users, AlertTriangle, CheckCircle, Calendar, Hospital, Siren } from "lucide-react"

// export default function BloodShortageFullForm() {
//   const [mounted, setMounted] = useState(false);
//   const [formData, setFormData] = useState({
//     bloodType: "A+",
//     availableUnits: "",
//     prevDayStock: "",
//     donatedUnits: "",
//     requestedUnits: "",
//     donorCount: "",
//     hospitalRequests: "",
//     emergencyCases: "",
//     isHoliday: "0",
//     specialEvent: "0"
//   });
//   const [prediction, setPrediction] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => { setMounted(true); }, []);

//   const handlePredict = async () => {
//     setLoading(true);
    
//     // بناء المصفوفة الـ 18 كما تدرب عليها الموديل
//     const payload = new Array(18).fill(0);
    
//     payload[1] = new Date().getMonth() + 1; // الشهر الحالي
//     payload[3] = Number(formData.availableUnits);
//     payload[4] = Number(formData.prevDayStock);
//     payload[5] = Number(formData.donatedUnits);
//     payload[6] = Number(formData.requestedUnits);
//     payload[7] = Number(formData.donorCount);
//     payload[8] = Number(formData.hospitalRequests);
//     payload[9] = Number(formData.emergencyCases);
//     payload[10] = Number(formData.isHoliday);
//     payload[11] = Number(formData.specialEvent);

//     try {
//       const response = await fetch("http://127.0.0.1:5000/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ data: payload }),
//       });
//       const result = await response.json();
//       setPrediction(result.prediction);
//     } catch (error) {
//       console.error("Prediction error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!mounted) return null;

//   return (
//     <div className="container mx-auto py-10 px-4">
//       <Card className="max-w-3xl mx-auto shadow-2xl border-t-4 border-red-600" suppressHydrationWarning>
//         <CardHeader className="text-center">
//           <CardTitle className="text-3xl font-bold flex justify-center items-center gap-2">
//             <Droplets className="text-red-600" /> Blood Shortage AI Predictor
//           </CardTitle>
//           <CardDescription>Fill in all details from the daily report for accurate prediction</CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-8">
//           {/* Main Inputs Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Blood Type & Month Section */}
//             <div className="space-y-4 p-4 bg-slate-50 rounded-xl border">
//                <Label className="font-bold text-red-700">General Info</Label>
//                <div className="space-y-2">
//                   <Label>Blood Type</Label>
//                   <Select onValueChange={(v) => setFormData({...formData, bloodType: v})}>
//                     <SelectTrigger><SelectValue placeholder="A+" /></SelectTrigger>
//                     <SelectContent>
//                       {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
//                     </SelectContent>
//                   </Select>
//                </div>
//             </div>

//             {/* Units Section */}
//             <div className="space-y-4 p-4 bg-red-50/30 rounded-xl border">
//                <Label className="font-bold text-red-700">Unit Metrics</Label>
//                <Input placeholder="Available Units" type="number" onChange={(e)=>setFormData({...formData, availableUnits: e.target.value})} />
//                <Input placeholder="Previous Day Stock" type="number" onChange={(e)=>setFormData({...formData, prevDayStock: e.target.value})} />
//                <Input placeholder="Donated Units" type="number" onChange={(e)=>setFormData({...formData, donatedUnits: e.target.value})} />
//                <Input placeholder="Requested Units" type="number" onChange={(e)=>setFormData({...formData, requestedUnits: e.target.value})} />
//             </div>

//             {/* Requests Section */}
//             <div className="space-y-4 p-4 bg-blue-50/30 rounded-xl border">
//                <Label className="font-bold text-blue-700">Demographics & Requests</Label>
//                <div className="flex items-center gap-2"><Users size={16}/> <Input placeholder="Donor Count" type="number" onChange={(e)=>setFormData({...formData, donorCount: e.target.value})} /></div>
//                <div className="flex items-center gap-2"><Hospital size={16}/> <Input placeholder="Hospital Requests" type="number" onChange={(e)=>setFormData({...formData, hospitalRequests: e.target.value})} /></div>
//                <div className="flex items-center gap-2"><Siren size={16}/> <Input placeholder="Emergency Cases" type="number" onChange={(e)=>setFormData({...formData, emergencyCases: e.target.value})} /></div>
//             </div>

//             {/* Events Section */}
//             <div className="space-y-4 p-4 bg-amber-50/30 rounded-xl border">
//                <Label className="font-bold text-amber-700">Calendar Context</Label>
//                <div className="space-y-1">
//                  <Label className="text-xs">Is Holiday?</Label>
//                  <Select onValueChange={(v) => setFormData({...formData, isHoliday: v})}>
//                    <SelectTrigger><SelectValue placeholder="No" /></SelectTrigger>
//                    <SelectContent><SelectItem value="0">No</SelectItem><SelectItem value="1">Yes</SelectItem></SelectContent>
//                  </Select>
//                </div>
//                <div className="space-y-1">
//                  <Label className="text-xs">Special Event?</Label>
//                  <Select onValueChange={(v) => setFormData({...formData, specialEvent: v})}>
//                    <SelectTrigger><SelectValue placeholder="No" /></SelectTrigger>
//                    <SelectContent><SelectItem value="0">No</SelectItem><SelectItem value="1">Yes</SelectItem></SelectContent>
//                  </Select>
//                </div>
//             </div>

//           </div>

//           <Button 
//             onClick={handlePredict} 
//             disabled={loading} 
//             className="w-full h-14 text-xl bg-red-600 hover:bg-red-700 shadow-lg"
//             suppressHydrationWarning
//           >
//             {loading ? "AI Processing..." : "Check Shortage Risk"}
//           </Button>

//           {/* Result Display */}
//           {prediction !== null && (
//             <div className={`p-8 rounded-2xl border-2 text-center animate-in zoom-in-95 duration-300 ${
//               prediction === 1 ? "bg-red-50 border-red-200 text-red-900" : "bg-green-50 border-green-200 text-green-900"
//             }`}>
//               {prediction === 1 ? <AlertTriangle className="mx-auto h-12 w-12 mb-4 text-red-600 animate-bounce" /> : <CheckCircle className="mx-auto h-12 w-12 mb-4 text-green-600" />}
//               <h3 className="text-2xl font-black mb-2">{prediction === 1 ? "CRITICAL SHORTAGE" : "STOCK STABLE"}</h3>
//               <p className="text-sm opacity-75">Based on 18 data features analyzed by our AI model.</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
// Works  Malak & Fatma
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { 
//   Upload, FileImage, Activity, AlertCircle, CheckCircle2, 
//   HeartPulse, Weight, User, Droplets, Hospital, Siren, Calendar, TrendingUp
// } from "lucide-react"

// // --- Interfaces ---
// interface AnalysisResult {
//   analysis: { RBC: number; WBC: number; Platelets: number };
//   overall_health: string;
//   observations: string[];
// }

// export default function BloodServicesDashboard() {
//   const [mounted, setMounted] = useState(false);

//   // --- States: Blood Image Analysis ---
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [analysisLoading, setAnalysisLoading] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
//   const [analysisError, setAnalysisError] = useState<string | null>(null);

//   // --- States: Donor Eligibility ---
//   const [donorData, setDonorData] = useState({ age: "", weight: "", chronic: false });
//   const [eligibilityResult, setEligibilityResult] = useState<{ status: string; message: string } | null>(null);

//   // --- States: Shortage Prediction ---
//   const [shortageData, setShortageData] = useState({
//     bloodType: "A+", availableUnits: "", prevDayStock: "", donatedUnits: "", 
//     requestedUnits: "", donorCount: "", hospitalRequests: "", emergencyCases: "",
//     isHoliday: "0", specialEvent: "0"
//   });
//   const [prediction, setPrediction] = useState<number | null>(null);
//   const [predictionLoading, setPredictionLoading] = useState(false);

//   useEffect(() => { setMounted(true); }, []);

//   // --- Functions ---

//   const handleAnalysis = async () => {
//     if (!selectedFile) return setAnalysisError("Please select an image.");
//     setAnalysisLoading(true); setAnalysisError(null);
//     const formData = new FormData(); formData.append('image', selectedFile);
//     try {
//       const res = await fetch('http://127.0.0.1:7000/analyze-blood', { method: 'POST', body: formData });
//       const data = await res.json();
//       setAnalysisResult(data);
//     } catch { setAnalysisError("Server connection failed."); }
//     finally { setAnalysisLoading(false); }
//   };

//   const checkEligibility = () => {
//     const { age, weight, chronic } = donorData;
//     if (!age || !weight) return setEligibilityResult({ status: "Rejected", message: "Fill all fields." });
//     if (parseInt(age) < 18 || parseInt(weight) < 50 || chronic) {
//       return setEligibilityResult({ status: "Rejected", message: "Criteria not met (Age/Weight/Chronic)." });
//     }
//     setEligibilityResult({ status: "Accepted", message: "Eligible to donate! ✅" });
//   };

//   const handlePredictShortage = async () => {
//     setPredictionLoading(true);
//     const payload = new Array(18).fill(0);
//     payload[1] = new Date().getMonth() + 1;
//     payload[3] = Number(shortageData.availableUnits);
//     payload[4] = Number(shortageData.prevDayStock);
//     payload[5] = Number(shortageData.donatedUnits);
//     payload[6] = Number(shortageData.requestedUnits);
//     payload[7] = Number(shortageData.donorCount);
//     payload[8] = Number(shortageData.hospitalRequests);
//     payload[9] = Number(shortageData.emergencyCases);
//     payload[10] = Number(shortageData.isHoliday);
//     payload[11] = Number(shortageData.specialEvent);

//     try {
//       const res = await fetch("http://127.0.0.1:6000/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ data: payload }),
//       });
//       const result = await res.json();
//       setPrediction(result.prediction);
//     } catch { console.error("Prediction failed."); }
//     finally { setPredictionLoading(false); }
//   };

//   if (!mounted) return null;

//   return (
//     <div className="container mx-auto py-10 px-4 space-y-10">
//       <header className="text-center space-y-2">
//         <h1 className="text-4xl font-black text-red-600 flex justify-center items-center gap-3">
//           <Droplets size={40} /> BLOOD BANK AI COMMAND
//         </h1>
//         <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold">Integrated Healthcare Management System</p>
//       </header>

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
//         {/* SECTION 1: IMAGE ANALYSIS */}
//         <Card className="shadow-lg border-t-4 border-red-500">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2"><FileImage className="text-red-500"/> Cell Analysis</CardTitle>
//             <CardDescription>Upload microscopic slide image</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="border-2 border-dashed rounded-xl p-6 text-center bg-slate-50">
//               <input type="file" className="hidden" id="blood-upload" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
//               <label htmlFor="blood-upload" className="cursor-pointer">
//                 <Upload className="mx-auto mb-2 text-slate-400" />
//                 <p className="text-xs font-bold">{selectedFile ? selectedFile.name : "Choose Image"}</p>
//               </label>
//             </div>
//             <Button onClick={handleAnalysis} disabled={analysisLoading} className="w-full bg-red-600">
//               {analysisLoading ? "Analyzing..." : "Analyze Slide"}
//             </Button>
//             {analysisResult && (
//               <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm animate-in fade-in">
//                 <div className="flex justify-between mb-2 font-bold">
//                   <span>Status: {analysisResult.overall_health}</span>
//                   <Badge variant={analysisResult.overall_health === "Normal" ? "default" : "destructive"}>Model Checked</Badge>
//                 </div>
//                 <p className="text-[10px] text-muted-foreground">RBC: {analysisResult.analysis.RBC} | WBC: {analysisResult.analysis.WBC} | PLT: {analysisResult.analysis.Platelets}</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* SECTION 2: ELIGIBILITY */}
//         <Card className="shadow-lg border-t-4 border-blue-500">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2"><User className="text-blue-500"/> Donor Screening</CardTitle>
//             <CardDescription>Physical condition check</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-1"><Label>Age</Label><Input type="number" value={donorData.age} onChange={(e)=>setDonorData({...donorData, age: e.target.value})}/></div>
//               <div className="space-y-1"><Label>Weight</Label><Input type="number" value={donorData.weight} onChange={(e)=>setDonorData({...donorData, weight: e.target.value})}/></div>
//             </div>
//             <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
//               <input type="checkbox" id="chronic" checked={donorData.chronic} onChange={()=>setDonorData({...donorData, chronic: !donorData.chronic})} />
//               <Label htmlFor="chronic" className="text-xs">Any Chronic Diseases?</Label>
//             </div>
//             <Button onClick={checkEligibility} variant="outline" className="w-full border-blue-600 text-blue-600">Verify Donor</Button>
//             {eligibilityResult && (
//               <div className={`p-3 rounded-lg text-center font-bold text-xs ${eligibilityResult.status === "Accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//                 {eligibilityResult.message}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* SECTION 3: PREDICTION (THE BIG ONE) */}
//         <Card className="shadow-lg border-t-4 border-black xl:col-span-1">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2"><TrendingUp /> Shortage Forecast</CardTitle>
//             <CardDescription>AI Prediction based on 18 features</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-3">
//              <div className="grid grid-cols-2 gap-2">
//                 <Input placeholder="Available" type="number" onChange={(e)=>setShortageData({...shortageData, availableUnits: e.target.value})} />
//                 <Input placeholder="Prev Stock" type="number" onChange={(e)=>setShortageData({...shortageData, prevDayStock: e.target.value})} />
//                 <Input placeholder="Donated" type="number" onChange={(e)=>setShortageData({...shortageData, donatedUnits: e.target.value})} />
//                 <Input placeholder="Requested" type="number" onChange={(e)=>setShortageData({...shortageData, requestedUnits: e.target.value})} />
//                 <Input placeholder="Donor Count" type="number" onChange={(e)=>setShortageData({...shortageData, donorCount: e.target.value})} />
//                 <Input placeholder="Emergency" type="number" onChange={(e)=>setShortageData({...shortageData, emergencyCases: e.target.value})} />
//              </div>
//              <div className="grid grid-cols-2 gap-2">
//                <Select onValueChange={(v)=>setShortageData({...shortageData, isHoliday: v})}>
//                  <SelectTrigger className="text-xs"><SelectValue placeholder="Holiday?" /></SelectTrigger>
//                  <SelectContent><SelectItem value="0">Work Day</SelectItem><SelectItem value="1">Holiday</SelectItem></SelectContent>
//                </Select>
//                <Select onValueChange={(v)=>setShortageData({...shortageData, specialEvent: v})}>
//                  <SelectTrigger className="text-xs"><SelectValue placeholder="Event?" /></SelectTrigger>
//                  <SelectContent><SelectItem value="0">Normal</SelectItem><SelectItem value="1">Special Event</SelectItem></SelectContent>
//                </Select>
//              </div>
//              <Button onClick={handlePredictShortage} disabled={predictionLoading} className="w-full bg-black text-white">
//                 {predictionLoading ? "Predicting..." : "Predict Shortage Risk"}
//              </Button>
//              {prediction !== null && (
//                <div className={`p-4 rounded-xl border-2 text-center font-black animate-bounce ${prediction === 1 ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
//                   {prediction === 1 ? "⚠️ CRITICAL SHORTAGE" : "✅ STABLE SUPPLY"}
//                </div>
//              )}
//           </CardContent>
//         </Card>

//       </div>
//     </div>
//   )
// }
// Samia & Yara
// "use client";

// import React, { useState, FormEvent } from "react";

// // Define the TypeScript shapes for our data
// interface FormData {
//   Is_Compatible: string;
//   Age: string;
//   Distance_KM: string;
//   Last_Donation_Days: string;
//   Historical_Response_Rate: string;
//   Blood_Quality_Score: string;
// }

// interface PredictionResult {
//   prediction: number;
//   probability: number;
// }

// // ✅ Correct Default Export for Next.js App Router
// export default function DonorEligibilityPage() {
//   const [formData, setFormData] = useState<FormData>({
//     Is_Compatible: "1",
//     Age: "",
//     Distance_KM: "",
//     Last_Donation_Days: "",
//     Historical_Response_Rate: "",
//     Blood_Quality_Score: "",
//   });

//   const [result, setResult] = useState<PredictionResult | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setResult(null);

//     // Parse data to match Flask API requirements (integers and floats)
//     const requestData = {
//       Is_Compatible: parseInt(formData.Is_Compatible),
//       Age: parseInt(formData.Age),
//       Distance_KM: parseFloat(formData.Distance_KM),
//       Last_Donation_Days: parseInt(formData.Last_Donation_Days),
//       Historical_Response_Rate: parseFloat(formData.Historical_Response_Rate),
//       Blood_Quality_Score: parseFloat(formData.Blood_Quality_Score),
//     };

//     try {
//       const response = await fetch("http://127.0.0.1:5000/predict-donor", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestData),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch prediction from the server.");
//       }

//       const data: PredictionResult = await response.json();
//       setResult(data);
//     } catch (err: any) {
//       setError(err.message || "An error occurred while connecting to the API. Is Flask running?");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//       <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
//         <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
//           Donor Eligibility Dashboard
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Is Compatible?
//             </label>
//             <select
//               name="Is_Compatible"
//               value={formData.Is_Compatible}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"
//             >
//               <option value="1">Yes (1)</option>
//               <option value="0">No (0)</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Age
//             </label>
//             <input
//               type="number"
//               name="Age"
//               value={formData.Age}
//               onChange={handleChange}
//               placeholder="e.g., 30"
//               required
//               className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Distance (KM)
//             </label>
//             <input
//               type="number"
//               step="0.1"
//               name="Distance_KM"
//               value={formData.Distance_KM}
//               onChange={handleChange}
//               placeholder="e.g., 5.5"
//               required
//               className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Days Since Last Donation
//             </label>
//             <input
//               type="number"
//               name="Last_Donation_Days"
//               value={formData.Last_Donation_Days}
//               onChange={handleChange}
//               placeholder="e.g., 120"
//               required
//               className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Historical Response Rate (0.0 - 1.0)
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               name="Historical_Response_Rate"
//               value={formData.Historical_Response_Rate}
//               onChange={handleChange}
//               placeholder="e.g., 0.85"
//               required
//               className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Blood Quality Score
//             </label>
//             <input
//               type="number"
//               step="0.1"
//               name="Blood_Quality_Score"
//               value={formData.Blood_Quality_Score}
//               onChange={handleChange}
//               placeholder="e.g., 9.2"
//               required
//               className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
//           >
//             {loading ? "Predicting..." : "Predict Match"}
//           </button>
//         </form>

//         {/* Error Message */}
//         {error && (
//           <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
//             <p>{error}</p>
//           </div>
//         )}

//         {/* Prediction Results */}
//         {result && (
//           <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-lg text-gray-800">
//             <h3 className="text-lg font-bold text-green-800 mb-2">Prediction Result</h3>
//             <p className="mb-1">
//               <strong>Match:</strong>{" "}
//               {result.prediction === 1 ? (
//                 <span className="text-green-600 font-semibold">Likely to Donate (1)</span>
//               ) : (
//                 <span className="text-red-600 font-semibold">Unlikely to Donate (0)</span>
//               )}
//             </p>
//             <p>
//               <strong>Confidence / Probability:</strong>{" "}
//               <span className="font-semibold">{(result.probability * 100).toFixed(2)}%</span>
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

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

// --- Interfaces ---
interface AnalysisResult {
  analysis: { RBC: number; WBC: number; Platelets: number };
  overall_health: string;
  observations: string[];
}

interface SmartDonorData {
  Is_Compatible: string;
  Age: string;
  Distance_KM: string;
  Last_Donation_Days: string;
  Historical_Response_Rate: string;
  Blood_Quality_Score: string;
}

interface SmartDonorResult {
  prediction: number;
  probability: number;
}

// ✅ Explicit default export for Next.js App Router page
export default function IntegratedBloodServicesDashboard() {
  const [mounted, setMounted] = useState(false);

  // --- States: 1. Blood Image Analysis ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // --- States: 2. Basic Donor Eligibility ---
  const [donorData, setDonorData] = useState({ age: "", weight: "", chronic: false });
  const [eligibilityResult, setEligibilityResult] = useState<{ status: string; message: string } | null>(null);

  // --- States: 3. Smart AI Donor Match ---
  const [smartDonorData, setSmartDonorData] = useState<SmartDonorData>({
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

  useEffect(() => { setMounted(true); }, []);

  // --- Functions: 1. Image Analysis ---
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
    } catch { 
      setAnalysisError("Server connection failed. Is port 7000 running?"); 
    } finally { 
      setAnalysisLoading(false); 
    }
  };

  // --- Functions: 2. Basic Eligibility ---
  const checkEligibility = () => {
    const { age, weight, chronic } = donorData;
    if (!age || !weight) return setEligibilityResult({ status: "Rejected", message: "Fill all fields." });
    if (parseInt(age) < 18 || parseInt(weight) < 50 || chronic) {
      return setEligibilityResult({ status: "Rejected", message: "Criteria not met (Age/Weight/Chronic)." });
    }
    setEligibilityResult({ status: "Accepted", message: "Eligible to donate! ✅" });
  };

  // --- Functions: 3. Smart AI Donor Match ---
  const handleSmartDonorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSmartDonorData({ ...smartDonorData, [e.target.name]: e.target.value });
  };

  const handleSmartDonorSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSmartDonorLoading(true);
    setSmartDonorError(null);
    setSmartDonorResult(null);

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

      if (!response.ok) throw new Error("Failed to fetch prediction from the server.");
      const data: SmartDonorResult = await response.json();
      setSmartDonorResult(data);
    } catch (err: any) {
      setSmartDonorError(err.message || "An error occurred. Is Flask running on port 5000?");
    } finally {
      setSmartDonorLoading(false);
    }
  };

  // --- Functions: 4. Shortage Prediction ---
  const handlePredictShortage = async () => {
    setPredictionLoading(true);
    const payload = new Array(18).fill(0);
    payload[1] = new Date().getMonth() + 1; // Current month
    payload[3] = Number(shortageData.availableUnits);
    payload[4] = Number(shortageData.prevDayStock);
    payload[5] = Number(shortageData.donatedUnits);
    payload[6] = Number(shortageData.requestedUnits);
    payload[7] = Number(shortageData.donorCount);
    payload[8] = Number(shortageData.hospitalRequests);
    payload[9] = Number(shortageData.emergencyCases);
    payload[10] = Number(shortageData.isHoliday);
    payload[11] = Number(shortageData.specialEvent);

    try {
      const res = await fetch("http://127.0.0.1:4000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setPrediction(result.prediction);
    } catch { 
      console.error("Prediction failed. Is port 6000 running?"); 
    } finally { 
      setPredictionLoading(false); 
    }
  };

  // Prevents hydration mismatches
  if (!mounted) return null;

  return (
    <div className="container mx-auto py-10 px-4 space-y-10 bg-gray-50 min-h-screen rounded-xl">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-black text-red-600 flex justify-center items-center gap-3">
          <Droplets size={40} /> BLOOD BANK AI COMMAND
        </h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold">Integrated Healthcare Management System</p>
      </header>

      {/* 2x2 Grid Layout for the 4 features */}
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

        {/* SECTION 2: BASIC ELIGIBILITY */}
        {/* <Card className="shadow-lg border-t-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="text-blue-500"/> Basic Donor Screening</CardTitle>
            <CardDescription>Physical condition baseline check</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Age</Label><Input type="number" value={donorData.age} onChange={(e)=>setDonorData({...donorData, age: e.target.value})}/></div>
              <div className="space-y-1"><Label>Weight (kg)</Label><Input type="number" value={donorData.weight} onChange={(e)=>setDonorData({...donorData, weight: e.target.value})}/></div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border">
              <input type="checkbox" id="chronic" checked={donorData.chronic} onChange={()=>setDonorData({...donorData, chronic: !donorData.chronic})} className="w-4 h-4 accent-blue-600" />
              <Label htmlFor="chronic" className="text-sm cursor-pointer">Any Chronic Diseases?</Label>
            </div>
            <Button onClick={checkEligibility} variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">Verify Donor</Button>
            {eligibilityResult && (
              <div className={`p-3 rounded-lg text-center font-bold text-sm ${eligibilityResult.status === "Accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {eligibilityResult.message}
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* SECTION 3: SMART AI DONOR MATCH */}
        <Card className="shadow-lg border-t-4 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HeartPulse className="text-green-500"/> AI Donor Match</CardTitle>
            <CardDescription>Predict likelihood of donation </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSmartDonorSubmit} className="space-y-4">
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

              <Button type="submit" disabled={smartDonorLoading} className="w-full bg-green-600 hover:bg-green-700 text-white">
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
                  {smartDonorResult.prediction === 1 ? (
                    <span className="text-green-600 font-bold">Likely to Donate (1)</span>
                  ) : (
                    <span className="text-red-600 font-bold">Unlikely to Donate (0)</span>
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
             <div className="grid grid-cols-2 gap-2">
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
          </CardContent>
        </Card>

      </div>
    </div>
  );
}