"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5004/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        localStorage.clear();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", String(data.userId));
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userName", data.name);

        // التوجيه للداشبورد مباشرة بناءً على الدور (Role)
        // الداشبورد هي المسؤولة عن التحقق إذا كان البروفايل يحتاج إكمال أم لا
        router.push(`/${data.role.toLowerCase()}`);
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("Server connection failed. Please ensure Backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-[400px]">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 font-serif">Login</h2>
         <Image
          src="/icon.svg"
          alt="BloodLink Logo"
          width={28}
          height={28}
          className="mx-auto mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-4 text-center font-bold font-serif">{error}</p>}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#c20000] outline-none font-serif"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#c20000] outline-none font-serif"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-[#c20000] text-white p-3 rounded-lg hover:bg-black transition font-bold font-serif"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-500 font-serif">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#c20000] hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}