"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, FileImage, Activity, AlertCircle, CheckCircle2 } from "lucide-react"

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

export default function BloodAnalysisUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const uploadAndAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // تأكد من تغيير URL إذا كان السيرفر يعمل على منفذ مختلف
      const response = await fetch('http://127.0.0.1:5000/analyze-blood', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze image");

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError("Could not connect to the server. Make sure Flask is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-8">
      <Card className="w-full max-w-2xl shadow-xl border">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <Activity className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">AI Blood Cell Analysis</CardTitle>
          <CardDescription>
            Upload a microscopic blood smear image to detect RBC, WBC, and Platelets
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          
          {/* Upload Area */}
          <div className="space-y-4">
            <Label htmlFor="blood-image" className="block text-sm font-medium">
              Select Blood Sample Image
            </Label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    {selectedFile ? (
                      <span className="font-semibold text-red-600">{selectedFile.name}</span>
                    ) : (
                      <span className="font-semibold">Click to upload or drag and drop</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG or JPEG (Microscopic View)</p>
                </div>
                <input 
                  id="blood-image" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={uploadAndAnalyze} 
            disabled={loading || !selectedFile}
            className="w-full text-lg py-6"
          >
            {loading ? "Analyzing Image..." : "Start AI Analysis"}
          </Button>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-800 border border-red-200 rounded-lg bg-red-50">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-4 pt-6 border-t animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FileImage className="h-5 w-5 text-blue-500" />
                  Analysis Report
                </h3>
                <Badge 
                  variant={result.overall_health === "Normal" ? "default" : "destructive"}
                  className="px-4 py-1"
                >
                  {result.overall_health}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg text-center border">
                  <p className="text-xs text-muted-foreground uppercase">RBC</p>
                  <p className="text-xl font-bold">{result.analysis.RBC}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center border">
                  <p className="text-xs text-muted-foreground uppercase">WBC</p>
                  <p className="text-xl font-bold">{result.analysis.WBC}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center border">
                  <p className="text-xs text-muted-foreground uppercase">Platelets</p>
                  <p className="text-xl font-bold">{result.analysis.Platelets}</p>
                </div>
              </div>

              {result.observations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Observations:</p>
                  <ul className="text-sm space-y-1">
                    {result.observations.map((obs, index) => (
                      <li key={index} className="flex items-center gap-2 text-amber-700">
                        <CheckCircle2 className="h-3 w-3" />
                        {obs}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}