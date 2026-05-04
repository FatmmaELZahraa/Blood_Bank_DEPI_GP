"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const router = useRouter(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await fetch("http://localhost:5004/api/auth/login", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json(); 
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userName", data.name);

        if (data.role === "Admin") {
          router.push("/admin"); 
        } else {
          router.push("/donor"); 
        }
      } else {
        const errorMsg = await response.text();
        setError(errorMsg || "Invalid email or password.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please ensure the Backend is running.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-[350px]"
      >
       

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 font-serif">
            
          Login
        </h2>
        <Image
          src="/icon.svg"
          alt="BloodLink Logo"  
          width={28}
          height={28}
          className="mx-auto mb-4"
         
        />

        {error && <p className="text-red-500 text-sm mb-4 text-center font-serif">{error}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c20000] font-serif  "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c20000] font-serif"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#c20000] text-white p-3 rounded-lg hover:bg-[#c20000] transition font-serif"
        >
          Login
        </button>
        <p className="text-sm text-center mt-4 text-gray-500 font-serif">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#c20000] hover:underline font-serif">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}