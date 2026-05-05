"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  name: string;
  email: string;
  bloodType: string;
  city: string;
  phone: string;
};

export default function ProfilePage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from login
        
        if (!token) {
          router.push("/login"); // Redirect if no token exists
          return;
        }

        const response = await fetch("http://localhost:5004/api/Auth/profile", {
          headers: {
            "Authorization": `Bearer ${token}` // Send JWT to secure endpoint
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear session data
    localStorage.removeItem("userRole");
    router.push("/login"); // Return to login page
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!userData) return null;

  const firstLetter = userData.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md border border-gray-100">
        
        {/* Profile Header Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-700 to-red-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-inner">
              {firstLetter}
            </div>
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-800 font-serif">{userData.name}</h2>
          <p className="text-gray-500 font-medium font-serif">{userData.email}</p>
        </div>

        {/* Info Grid - Dynamic Data from DB */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-center">
            <p className="text-xs text-red-400 uppercase font-bold tracking-wider font-serif">Blood Type</p>
            <p className="text-xl font-bold text-red-700">{userData.bloodType || "N/A"}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
            <p className="text-xs text-blue-400 uppercase font-bold tracking-wider font-serif">City</p>
            <p className="text-lg font-semibold text-blue-700">{userData.city || "Cairo"}</p>
          </div>
        </div>

        {/* Secondary Details */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-500 text-sm font-serif">Phone</span>
            <span className="text-gray-800 font-medium font-serif">{userData.phone}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button className="w-full bg-red-700 text-white py-3 rounded-xl font-semibold hover:bg-red-600 active:scale-95 transition-all shadow-md">
            Edit Profile
          </button>
          <button 
            onClick={handleLogout}
            className="w-full bg-white text-gray-600 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function ProfilePage() {
//   const [userData, setUserData] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     // استخدمي "token" بحرف t صغير كما يظهر في صورتك تماماً
//     const token = localStorage.getItem("token");
    
//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     const fetchProfile = async () => {
//       try {
//         const response = await fetch("http://localhost:5004/api/Auth/profile", { 
//           headers: {
//             "Authorization": `Bearer ${token}`
//           }
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setUserData(data);
//         } else {
//           console.error("Server rejected the token");
//           router.push("/login");
//         }
//       } catch (err) {
//         console.error("Connection error:", err);
//       }
//     };

//     fetchProfile();
//   }, [router]);

//   if (!userData) return <p className="text-center p-10">Loading Your Information...</p>;

//   return (
//     <div className="p-10 border rounded shadow-lg max-w-md mx-auto mt-10">
//       <h1 className="text-2xl font-bold border-b pb-2 mb-4">User Profile</h1>
//       <p><strong>Name:</strong> {userData.name}</p>
//       <p><strong>Email:</strong> {userData.email}</p>
//       <p><strong>Phone:</strong> {userData.phone}</p>
//       <p><strong>Role:</strong> {userData.role}</p>
//         <p><strong>Address:</strong> {userData.address}</p>
//     </div>
//   );
// }