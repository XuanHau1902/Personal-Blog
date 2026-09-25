/** Decodes the stored JWT's payload — no backend call needed to know who's
 * currently logged in or what role they have. */
function decodeAccessToken(): Record<string, unknown> | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function getCurrentUsername(): string | null {
  return (decodeAccessToken()?.sub as string | undefined) ?? null;
}

export function isAdmin(): boolean {
  return decodeAccessToken()?.role === "ADMIN";
}
