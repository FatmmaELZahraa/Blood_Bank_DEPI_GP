"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, FileImage, Activity, AlertCircle, CheckCircle2, 
  HeartPulse, Weight, User, ArrowRightLeft 
} from "lucide-react"

interface AnalysisResult {
  status: string;
  analysis: {
    RBC: number;
    WBC: number;
    Platelets: number;
  };
  overall_health: string;
  observations: string[];
  message: string;
}

export default function BloodServicesPage() {
  // --- States لمكون تحليل الصور ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // --- States لمكون أهلية المتبرع ---
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [chronic, setChronic] = useState(false)
  const [eligibilityResult, setEligibilityResult] = useState<null | { status: string; message: string }>(null)

  // --- وظيفة تحليل الصورة ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalysisError(null);
    }
  };

  const uploadAndAnalyze = async () => {
    if (!selectedFile) {
      setAnalysisError("Please select an image first.");
      return;
    }
    setAnalysisLoading(true);
    setAnalysisError(null);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze-blood', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to analyze image");
      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setAnalysisError("Could not connect to the server. Make sure Flask is running.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const checkEligibility = () => {
    if (!age || !weight) {
      setEligibilityResult({ status: "Rejected", message: "Please fill in all fields." })
      return
    }
    if (parseInt(age) < 18) {
      setEligibilityResult({ status: "Rejected", message: "Age must be at least 18." })
      return
    }
    if (parseInt(weight) < 50) {
      setEligibilityResult({ status: "Rejected", message: "Weight must be at least 50 kg." })
      return
    }
    if (chronic) {
      setEligibilityResult({ status: "Rejected", message: "Chronic diseases are not allowed." })
      return
    }
    setEligibilityResult({ status: "Accepted", message: "You are eligible to donate blood ✅" })
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-12">
      
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Blood Services Dashboard</h1>
        <p className="text-muted-foreground text-lg">Manage blood analysis and donor eligibility in one place.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        <Card className="shadow-xl border-t-4 border-t-red-600 h-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-6 w-6 text-red-600" />
              <CardTitle>AI Blood Cell Analysis</CardTitle>
            </div>
            <CardDescription>Upload microscopic image to count RBC, WBC, and Platelets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <Upload className="w-8 h-8 mb-3 text-slate-400" />
                  <p className="text-sm text-slate-600">
                    {selectedFile ? <span className="font-bold text-red-600">{selectedFile.name}</span> : "Click to upload blood smear"}
                  </p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>

            <Button onClick={uploadAndAnalyze} disabled={analysisLoading || !selectedFile} className="w-full">
              {analysisLoading ? "Processing..." : "Blood Analysis"}
            </Button>

            {analysisError && (
              <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md flex gap-2">
                <AlertCircle className="h-4 w-4" /> {analysisError}
              </div>
            )}

            {analysisResult && (
              <div className="p-4 bg-slate-50 rounded-xl border space-y-4 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold uppercase tracking-wider">Results:</span>
                  <Badge variant={analysisResult.overall_health === "Normal" ? "default" : "destructive"}>
                    {analysisResult.overall_health}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded shadow-sm border"><p className="text-[10px] text-muted-foreground">RBC</p><p className="font-bold">{analysisResult.analysis.RBC}</p></div>
                  <div className="bg-white p-2 rounded shadow-sm border"><p className="text-[10px] text-muted-foreground">WBC</p><p className="font-bold">{analysisResult.analysis.WBC}</p></div>
                  <div className="bg-white p-2 rounded shadow-sm border"><p className="text-[10px] text-muted-foreground">PLT</p><p className="font-bold">{analysisResult.analysis.Platelets}</p></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- المكون الثاني: التأكد من أهلية المتبرع --- */}
        <Card className="shadow-xl border-t-4 border-t-blue-600 h-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <User className="h-6 w-6 text-blue-600" />
              <CardTitle>Donor Eligibility Check</CardTitle>
            </div>
            <CardDescription>Enter physical details to confirm donation eligibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><User className="h-4 w-4" /> Age</Label>
              <Input type="number" placeholder="Min 18 years" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Weight className="h-4 w-4" /> Weight (kg)</Label>
              <Input type="number" placeholder="Min 50 kg" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 bg-slate-50">
              <input type="checkbox" checked={chronic} onChange={() => setChronic(!chronic)} className="h-4 w-4" id="chronic" />
              <Label htmlFor="chronic" className="flex items-center gap-2 cursor-pointer text-sm">
                <HeartPulse className="h-4 w-4 text-red-500" /> Do you have chronic diseases?
              </Label>
            </div>

            <Button onClick={checkEligibility} variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
              Check Eligibility
            </Button>

            {eligibilityResult && (
              <div className="text-center p-4 border-t animate-in slide-in-from-bottom-2">
                <Badge variant={eligibilityResult.status === "Accepted" ? "default" : "destructive"} className="mb-2">
                  {eligibilityResult.status}
                </Badge>
                <p className="text-sm text-muted-foreground">{eligibilityResult.message}</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}