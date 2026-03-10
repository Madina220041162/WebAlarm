import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setLoggedInState } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        
        if (!code) {
          setError("No authorization code received from Google");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // Exchange code for token via backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google-callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Google callback failed");
        }

        const data = await response.json();
        const { token, user } = data;
        
        // Set logged-in state and redirect
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.removeItem("guestMode");
        
        navigate("/");
      } catch (err) {
        console.error("Google callback error:", err);
        setError(err.message || "Failed to complete Google login");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md p-10 rounded-xl text-center">
        {error ? (
          <>
            <div className="mb-6 p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-sm font-bold">
              {error}
            </div>
            <p className="text-slate-500">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-block">
                <div className="animate-spin">
                  <span className="material-symbols-outlined text-4xl text-primary">
                    loading
                  </span>
                </div>
              </div>
            </div>
            <p className="text-slate-600 font-semibold">Completing Google sign-in...</p>
          </>
        )}
      </div>
    </div>
  );
}
