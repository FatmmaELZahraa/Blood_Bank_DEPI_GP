"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5004";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    window.location.href = "/login";
    return null;
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("API Error:", res.status, err);
    throw new Error(err.message || "Request failed");
  }
  return res.status === 204 ? null : res.json();
}

type UserProfile = {
  userId: number;
  name: string;
  email: string;
  bloodType?: string;
  city?: string;
  phone: string;
  medicalHistory?: string;
  address?: string;
  role: string;
};

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodType: "",
    medicalHistory: "",
    address: "",
  });

  useEffect(() => {
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await apiFetch("/api/EditProfile");
      if (response?.success && response?.data) {
        setUserData(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          bloodType: response.data.bloodType || "",
          medicalHistory: response.data.medicalHistory || "",
          address: response.data.address || "",
        });
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      // Build payload matching EditProfileDto structure
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: String(formData.phone),
      };

      if (userData?.role === "Donor") {
        updateData.bloodType = formData.bloodType;
        updateData.medicalHistory = formData.medicalHistory || "";
      }

      if (userData?.role === "Hospital") {
        updateData.address = formData.address || "";
      }

      const response = await apiFetch("/api/EditProfile", {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      if (response?.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        // Refresh profile data
        await fetchProfile();
      } else {
        setError(response?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );

  if (!userData) return null;

  const firstLetter = userData.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-2xl border border-gray-100">
        {/* Error & Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        {!isEditing ? (
          <>
            {/* View Mode */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-700 to-red-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-inner">
                  {firstLetter}
                </div>
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>

              <h2 className="mt-4 text-2xl font-bold text-gray-800 font-serif">
                {userData.name}
              </h2>
              <p className="text-gray-500 font-medium font-serif">
                {userData.email}
              </p>
            </div>

            {/* Info Grid */}
            <div className="mt-8 grid grid-cols-1 gap-4">
              {userData.role === "Donor" && (
                <>
                  <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-center">
                    <p className="text-xs text-red-400 uppercase font-bold tracking-wider font-serif">
                      Blood Type
                    </p>
                    <p className="text-xl font-bold text-red-700">
                      {userData.bloodType || "N/A"}
                    </p>
                  </div>
                  {/* <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                    <p className="text-xs text-blue-400 uppercase font-bold tracking-wider font-serif">
                      City
                    </p>
                    <p className="text-lg font-semibold text-blue-700">
                      {userData.city || "N/A"}
                    </p>
                  </div> */}
                </>
              )}
              {userData.role === "Hospital" && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-center col-span-2">
                  <p className="text-xs text-purple-400 uppercase font-bold tracking-wider font-serif">
                    Address
                  </p>
                  <p className="text-lg font-semibold text-purple-700">
                    {userData.address || "N/A"}
                  </p>
                </div>
              )}
            </div>

            {/* Secondary Details */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-500 text-sm font-serif">Phone</span>
                <span className="text-gray-800 font-medium font-serif">
                  {userData.phone}
                </span>
              </div>
              {userData.role === "Donor" && userData.medicalHistory && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 text-sm font-serif">
                    Medical History
                  </span>
                  <span className="text-gray-800 font-medium font-serif">
                    {userData.medicalHistory}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-red-700 text-white py-3 rounded-xl font-semibold hover:bg-red-600 active:scale-95 transition-all shadow-md"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-white text-gray-600 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Edit Mode */}
            <h2 className="text-2xl font-bold text-gray-800 font-serif mb-6">
              Edit Profile
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfile();
              }}
              className="space-y-4"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </div>

              {/* Donor-specific fields */}
              {userData.role === "Donor" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Blood Type
                    </label>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bloodType: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                    >
                      <option value="">Select Blood Type</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Medical History
                    </label>
                    <textarea
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                    />
                  </div>
                </>
              )}

              {/* Hospital-specific fields */}
              {userData.role === "Hospital" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-red-700 text-white py-3 rounded-xl font-semibold hover:bg-red-600 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-white text-gray-600 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
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
