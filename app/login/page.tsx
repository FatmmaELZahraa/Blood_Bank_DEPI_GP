"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. استيراد useRouter
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // 2. تهيئة الراوتر

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // هنا تضع منطق التحقق من البيانات (مثل إرسالها للـ API)
    console.log(email, password);

    router.push(""); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-[350px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Login
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBBC7]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3DBBC7]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#3DBBC7] text-white p-3 rounded-lg hover:bg-[#2daab5] transition"
        >
          Login
        </button>
        <p className="text-sm text-center mt-4 text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#3DBBC7] hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}