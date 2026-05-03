/**
 * Google OAuth helper.
 *
 * Set VITE_GOOGLE_AUTH_URL to your backend's Google OAuth start endpoint
 * (e.g. "https://api.yourapp.com/auth/google") which should redirect the
 * browser to Google's consent screen with prompt=select_account so the
 * user can choose which Gmail account to use when they have several.
 *
 * If not set, we fall back to a simulated flow for local UI development.
 */
export const GOOGLE_AUTH_URL = import.meta.env.VITE_GOOGLE_AUTH_URL as string | undefined;

export const startGoogleLogin = () => {
  if (GOOGLE_AUTH_URL) {
    // Force account chooser even if user is already signed into one Google account
    const url = new URL(GOOGLE_AUTH_URL);
    if (!url.searchParams.has("prompt")) url.searchParams.set("prompt", "select_account");
    window.location.href = url.toString();
    return true;
  }
  return false;
};
