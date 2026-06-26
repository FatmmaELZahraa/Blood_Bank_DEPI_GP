"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function CompleteProfile() {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    bloodType: '',
    age: '',
    lastDonationDays: '',
    distanceKM: '',
  });

  useEffect(() => {
    setIsMounted(true);
    
    const verifyAccess = async () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("userRole");

      if (!token || !userRole) {
        router.replace("/login");
        return;
      }

      if (userRole !== "Donor") {
        router.replace("/");
        return;
      }

      try {
        const res = await fetch("http://localhost:5004/api/Auth/profile", {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (!res.ok) {
          localStorage.clear();
          router.replace("/login");
          return;
        }

        const data = await res.json();

        // Redirect if profile is already complete
        if (data.bloodType && data.bloodType !== "N/A" && data.bloodType.trim() !== "") {
          router.replace("/donor");
          return;
        }

        setIsChecking(false);
      } catch (err) {
        setError("Unable to connect to the server.");
        setIsChecking(false);
      }
    };

    verifyAccess();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5004/api/Donor/complete-profile/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          BloodType: formData.bloodType,
          Age: parseInt(formData.age),
          Last_Donation_Days: parseInt(formData.lastDonationDays),
          Distance_KM: parseFloat(formData.distanceKM),
          Historical_Response_Rate: 1.0,
          Blood_Quality_Score: 10.0
        }),
      });

      if (!response.ok) throw new Error('Failed to save profile');
      localStorage.removeItem("donorProfile"); // مسح البيانات القديمة لضمان جلب بيانات جديدة
      window.dispatchEvent(new Event("profileUpdated"));

      setMessage('Profile Saved Successfully! Redirecting to Dashboard...');
      
      setTimeout(() => {
        router.replace("/donor");
      }, 3000); 

    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!isMounted || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="w-full max-w-2xl bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl text-gray-900 mb-3 font-bold">Complete Your Profile</h2>
          <p className="text-gray-500 text-lg font-serif">Every drop counts. Complete your profile to start saving lives.</p>
        </div>

        {message && <div className="p-4 mb-6 bg-green-50 text-green-700 rounded-xl text-center font-bold">{message}</div>}
        {error && <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-xl text-center font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Blood Type</label>
              <select name="bloodType" onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition h-14">
                <option value="">Select Blood Type</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Age</label>
              <input type="number" name="age" onChange={handleChange} required className="w-full h-14 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Days Since Last Donation</label>
              <input type="number" name="lastDonationDays" onChange={handleChange} required className="w-full h-14 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Distance from Hospital (KM)</label>
              <input type="number" step="0.1" name="distanceKM" onChange={handleChange} required className="w-full h-14 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition" />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full md:w-80 h-16 bg-red-600 hover:bg-black text-white font-black rounded-2xl text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center"
            >
              {loading ? 'Saving...' : 'Save & Start Saving Lives'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}