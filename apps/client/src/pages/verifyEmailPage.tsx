import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const {setUser} = useAuth();

  const hasCalled = useRef(false);
  
  useEffect(() => {
    // 2. If already called, do nothing
    if (hasCalled.current) return;

    const verify = async () => {
      // 3. Set to true immediately
      hasCalled.current = true;
      
      try {
        console.log("Sending verification request to backend...");
        await api.get(`/auth/verify?token=${token}`);
        setStatus("success");
        // 2. Update the local state so the Profile page knows we are verified
        setUser((prev: any) => ({ ...prev, isVerified: true }));
        
        // Optional: Update your local AuthContext user state here if needed
        setTimeout(() => navigate("/profile"), 3000);
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
      }
    };

    if (token) {
      verify();
    }
  }, [token, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#f0f2f5]">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {status === "verifying" && <p className="text-gray-600 animate-pulse">Verifying your email...</p>}
        {status === "success" && (
          <div>
            <h1 className="text-2xl font-bold text-green-600">Verified!</h1>
            <p className="mt-2 text-gray-500">Redirecting you to your profile...</p>
          </div>
        )}
        {status === "error" && (
          <div>
            <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
            <p className="mt-2 text-gray-500">Link may be expired or invalid.</p>
            <button onClick={() => navigate("/profile")} className="mt-4 text-[#008069] underline">Back to Profile</button>
          </div>
        )}
      </div>
    </div>
  );
}