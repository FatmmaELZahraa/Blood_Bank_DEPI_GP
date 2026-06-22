"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email, please wait...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5004/api/Auth/verify-email?token=${token}`, {
          method: "GET",
        });

        if (response.ok) {
          setStatus("success");
          setMessage("Your email has been successfully verified! You can now log in.");
        } else {
          const errorText = await response.text();
          setStatus("error");
          setMessage(errorText || "Verification failed. The token may be expired or invalid.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Unable to connect to the server. Please try again later.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-[450px] text-center font-serif">
      {status === "loading" && (
        <div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c20000] mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-700">Verifying...</h2>
          <p className="text-gray-500 mt-2">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Activated!</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link
            href="/login"
            className="inline-block w-full bg-[#c20000] text-white p-3 rounded-lg hover:bg-black transition font-bold"
          >
            Go to Login
          </Link>
        </div>
      )}

      {status === "error" && (
        <div>
          <div className="text-5xl mb-4 text-red-500">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link
            href="/register"
            className="inline-block w-full bg-gray-800 text-white p-3 rounded-lg hover:bg-black transition font-bold mb-3"
          >
            Back to Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Suspense fallback={
        <div className="bg-white p-8 rounded-2xl shadow-md text-center font-serif">
          <p className="text-gray-500">Loading page...</p>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}