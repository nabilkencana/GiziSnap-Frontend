// Helper untuk API calls ke backend GiziSnap
// Di development: proxy Vite ke localhost:3000
// Di production (Vercel): langsung hit Railway backend URL

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Wrapper fetch yang otomatis prefix URL dengan backend base URL
 * Contoh: apiFetch('/api/auth/login', ...) 
 */
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  return fetch(url, options);
}

export default API_BASE;
