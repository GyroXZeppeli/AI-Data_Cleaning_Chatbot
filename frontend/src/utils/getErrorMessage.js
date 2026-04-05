const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function getErrorMessage(error) {
  // Axios-style network error (no response received)
  if (error && !error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.request)) {
    return `Cannot reach the server at ${API_BASE_URL}. Make sure the backend is running, then try again.`;
  }

  const detail =
    error?.response?.data?.detail ??
    error?.response?.data?.message ??
    error?.response?.data?.error;

  if (typeof detail === 'string' && detail.trim()) return detail.trim();

  if (Array.isArray(detail)) {
    // FastAPI validation errors sometimes return arrays
    const first = detail[0];
    if (typeof first === 'string') return first;
    if (first?.msg) return String(first.msg);
  }

  if (error?.response?.status === 401) return 'Incorrect email or password.';
  if (error?.response?.status === 400) return 'Please check your details and try again.';

  return DEFAULT_MESSAGE;
}
