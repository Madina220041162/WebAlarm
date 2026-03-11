const ACTIVE_PROOF_CHALLENGE_KEY = "activeProofChallenge";
const PROOF_VERIFICATION_RESULT_KEY = "proofVerificationResult";

const PROOF_TARGETS = ["cat", "dog", "person", "car", "bottle", "cup", "chair"];

export function getRandomProofTarget() {
  return PROOF_TARGETS[Math.floor(Math.random() * PROOF_TARGETS.length)];
}

export function getProofTargets() {
  return [...PROOF_TARGETS];
}

export function saveActiveProofChallenge(challenge) {
  localStorage.setItem(ACTIVE_PROOF_CHALLENGE_KEY, JSON.stringify(challenge));
  window.dispatchEvent(new Event("proof-challenge-updated"));
}

export function getActiveProofChallenge() {
  try {
    const raw = localStorage.getItem(ACTIVE_PROOF_CHALLENGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearActiveProofChallenge() {
  localStorage.removeItem(ACTIVE_PROOF_CHALLENGE_KEY);
  window.dispatchEvent(new Event("proof-challenge-updated"));
}

export function saveProofVerificationResult(result) {
  localStorage.setItem(PROOF_VERIFICATION_RESULT_KEY, JSON.stringify(result));
  window.dispatchEvent(new Event("proof-verification-updated"));
}

export function getProofVerificationResult() {
  try {
    const raw = localStorage.getItem(PROOF_VERIFICATION_RESULT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearProofVerificationResult() {
  localStorage.removeItem(PROOF_VERIFICATION_RESULT_KEY);
  window.dispatchEvent(new Event("proof-verification-updated"));
}
