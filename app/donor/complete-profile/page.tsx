// "use client";

// import React, { useState, useEffect, FormEvent } from 'react';
// import { useRouter } from 'next/navigation';

// export default function CompleteProfile() {
//   const router = useRouter();
//   const [isMounted, setIsMounted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const [formData, setFormData] = useState({
//     bloodType: '',
//     age: '',
//     lastDonationDays: '',
//     distanceKM: '',
//   });

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);
//     setError(null);

//     const userId = localStorage.getItem("userId");

//     try {
//       const response = await fetch(`http://localhost:5004/api/Donor/complete-profile/${userId}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           BloodType: formData.bloodType,
//           Age: parseInt(formData.age),
//           Last_Donation_Days: parseInt(formData.lastDonationDays),
//           Distance_KM: parseFloat(formData.distanceKM),
//           Historical_Response_Rate: 1.0,
//           Blood_Quality_Score: 10.0
//         }),
//       });

//       if (!response.ok) throw new Error('Failed');

//       setMessage('Profile Saved Successfully!');
//       setTimeout(() => router.push("/donor"), 1500);
//     } catch (err) {
//       setError('Something went wrong.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isMounted) return null;

//   return (
//     <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-[5%] left-[5%] text-[180px] opacity-20 rotate-12">🩸</div>
//         <div className="absolute bottom-[10%] right-[5%] text-[200px] opacity-20">🧪</div>
//         <div className="absolute top-[40%] right-[2%] text-[150px] opacity-15 -rotate-12">🩸</div>
//         <div className="absolute bottom-[40%] left-[2%] text-[150px] opacity-15 rotate-12">🧬</div>
        
//         <div className="absolute top-[15%] right-[10%] text-gray-800 text-5xl font-black italic tracking-tighter opacity-30 text-right font-serif">
//           "YOUR BLOOD <br/> IS A GIFT"
//         </div>
//         <div className="absolute bottom-[15%] left-[10%] text-red-700 text-5xl font-black italic tracking-tighter opacity-40 text-left font-serif">
//           "BE A HERO <br/> SAVE A LIFE"
//         </div>
//       </div>

//       <div className="w-full max-w-2xl bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 z-10">
//         <div className="text-center mb-10">
//           <h2 className="text-4xl  text-gray-900 mb-3 focus-within:">Please Complete Your Profile </h2>
//           <p className="text-gray-500 text-lg font-serif">Every drop counts. Complete your profile to start saving lives.</p>
//         </div>

//         {message && <div className="p-4 mb-6 bg-green-50 text-green-700 rounded-xl text-center font-bold">{message}</div>}
//         {error && <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-xl text-center font-bold">{error}</div>}

//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-2">
//               <label className="block text-sm font-bold text-gray-700">Blood Type</label>
//               <select name="bloodType" onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition h-14">
//                 <option value="">Select</option>
//                 {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-bold text-gray-700">Age</label>
//               <input type="number" name="age" onChange={handleChange} required className=" p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition w-full h-12" />
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-bold text-gray-700">Days Since Last Donation</label>
//               <input type="number" name="lastDonationDays" onChange={handleChange} required className="w-full h-12 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition" />
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-bold text-gray-700">Distance from Hospital (KM)</label>
//               <input type="number" step="0.1" name="distanceKM" onChange={handleChange} required className="w-full h-12 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition" />
//             </div>
//           </div>

//           <button type="submit" disabled={loading} className="w-100 h-18 bg-red-600 hover:bg-black text-white font-black py-5 rounded-2xl text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99]">
//             {loading ? 'Saving...' : 'Save & Start Saving Lives'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function CompleteProfile() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
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
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(`http://localhost:5004/api/Donor/complete-profile/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BloodType: formData.bloodType,
          Age: parseInt(formData.age),
          Last_Donation_Days: parseInt(formData.lastDonationDays),
          Distance_KM: parseFloat(formData.distanceKM),
          Historical_Response_Rate: 1.0,
          Blood_Quality_Score: 10.0
        }),
      });

      if (!response.ok) throw new Error('Failed');

      setMessage('Profile Saved Successfully!');
      setTimeout(() => router.push("/donor"), 1500);
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[5%] text-[180px] opacity-20 rotate-12">🩸</div>
        <div className="absolute bottom-[10%] right-[5%] text-[200px] opacity-20">🧪</div>
        <div className="absolute top-[40%] right-[2%] text-[150px] opacity-15 -rotate-12">🩸</div>
        <div className="absolute bottom-[40%] left-[2%] text-[150px] opacity-15 rotate-12">🧬</div>
        
        <div className="absolute top-[15%] right-[10%] text-gray-800 text-5xl font-black italic tracking-tighter opacity-30 text-right font-serif">
          "YOUR BLOOD <br/> IS A GIFT"
        </div>
        <div className="absolute bottom-[15%] left-[10%] text-red-700 text-5xl font-black italic tracking-tighter opacity-40 text-left font-serif">
          "BE A HERO <br/> SAVE A LIFE"
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl text-gray-900 mb-3">Please Complete Your Profile</h2>
          <p className="text-gray-500 text-lg font-serif">Every drop counts. Complete your profile to start saving lives.</p>
        </div>

        {message && <div className="p-4 mb-6 bg-green-50 text-green-700 rounded-xl text-center font-bold">{message}</div>}
        {error && <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-xl text-center font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Blood Type</label>
              <select name="bloodType" onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition h-14">
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Age</label>
              <input type="number" name="age" onChange={handleChange} required className=" p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition w-full h-12" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Days Since Last Donation</label>
              <input type="number" name="lastDonationDays" onChange={handleChange} required className="w-full h-12 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Distance from Hospital (KM)</label>
              <input type="number" step="0.1" name="distanceKM" onChange={handleChange} required className="w-full h-12 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-red-600 outline-none transition" />
            </div>
          </div>

          {/* Centered Button Container */}
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