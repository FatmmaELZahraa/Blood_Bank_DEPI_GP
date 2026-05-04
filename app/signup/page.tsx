"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Donor"); // Default role set to Donor
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Ensure the port (e.g., 5004) matches your running .NET API
      const response = await fetch("http://localhost:5004/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          phone: parseInt(phone), // Convert phone string to integer for the API
          role: role,
        }),
      });

      if (response.ok) {
        // Redirect to login page upon successful registration
        router.push("/login");
      } else {
        const errorData = await response.text();
        setError(errorData || "An error occurred during registration.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please ensure the Backend is running.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-[400px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 font-serif">
          Sign Up 
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center font-bold font-serif">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c20000] font-serif"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c20000] font-serif"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Phone Number"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c20000] font-serif"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          {/* Role selection based on the system diagram: Admin or Donor[cite: 1] */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              User Role:
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c20000] bg-white cursor-pointer font-serif"
            >
              <option value="Donor">Donor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c20000] font-serif"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-[#c20000] text-white p-3 rounded-lg hover:bg-[#000202] transition font-bold font-serif"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-4 text-gray-500 font-serif">
          Already have an account?{" "}
          <Link href="/login" className="text-[#c20000] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}