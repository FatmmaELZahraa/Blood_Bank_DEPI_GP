import React from 'react';

/**
 * User Type definition for TypeScript type safety
 */
type User = {
  name: string;
  email: string;
  bloodType: string;
  city: string;
  phone: string;
};

/**
 * Mock data representing a user from a database
 */
const userData: User = {
  name: "Samia Samy",
  email: "samia@gmail.com",
  bloodType: "A+",
  city: "Cairo",
  phone: "01227328650",
};

export default function ProfilePage() {
  // Safe extraction of the first letter for the avatar
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
            {/* Status Indicator */}
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-800">{userData.name}</h2>
          <p className="text-gray-500 font-medium">{userData.email}</p>
        </div>

        {/* Info Grid - Important Blood Bank Data */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-center">
            <p className="text-xs text-red-400 uppercase font-bold tracking-wider">Blood Type</p>
            <p className="text-xl font-bold text-red-700">{userData.bloodType}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
            <p className="text-xs text-blue-400 uppercase font-bold tracking-wider">City</p>
            <p className="text-lg font-semibold text-blue-700">{userData.city}</p>
          </div>
        </div>

        {/* Secondary User Details */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-500 text-sm">Phone</span>
            <span className="text-gray-800 font-medium">{userData.phone}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button className="w-full bg-red-700 text-white py-3 rounded-xl font-semibold hover:bg-red-600 active:scale-95 transition-all shadow-md">
            Edit Profile
          </button>
          <button className="w-full bg-white text-gray-600 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}