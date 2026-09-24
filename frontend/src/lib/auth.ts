/** Reads the `sub` (username) claim straight out of the stored JWT — no
 * backend call needed to know who's currently logged in. */
export function getCurrentUsername(): string | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json).sub ?? null;
  } catch {
    return null;
  }
}
