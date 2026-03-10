import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) &&
  Boolean(firebaseConfig.authDomain) &&
  Boolean(firebaseConfig.projectId) &&
  Boolean(firebaseConfig.appId);

let auth = null;
let provider = null;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
}

export async function signInWithGooglePopup() {
  // Fallback: Use simple Google OAuth flow without Firebase if not configured
  if (!isFirebaseConfigured || !auth || !provider) {
    return signInWithGoogleViaBackend();
  }

  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  return { idToken, profile: result.user };
}

// Simple backend-based Google OAuth flow
export async function signInWithGoogleViaBackend() {
  try {
    // Call backend to initiate Google OAuth
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google-auth-url`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to get Google auth URL");
    }

    const { authUrl } = await response.json();
    
    // Redirect to Google OAuth
    window.location.href = authUrl;
  } catch (error) {
    throw new Error(error.message || "Google OAuth initiation failed");
  }
}

export { isFirebaseConfigured };
