// src/utils/api.js

export const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_API_URL is not defined. Set it in your .env file.");
  }

  if (import.meta.env.PROD && apiUrl.includes("localhost")) {
    throw new Error(
      "Production build is pointing to localhost API. Fix VITE_API_URL.",
    );
  }

  return apiUrl;
};

/**
 * FIXED: This helper was missing and causing your ReferenceError.
 * It builds the full URL by combining the base and the path.
 */
export const buildApiUrl = (path) => {
  const base = getApiUrl();
  // Ensure the path starts with a slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

export const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timeout - please check your connection");
    }
    throw error;
  }
};

const extractErrorMessage = (errorData, fallback) => {
  const d = errorData?.detail;
  if (typeof d === "string" && d.trim()) return d;
  if (Array.isArray(d) && d.length > 0) {
    const msgs = d
      .map((x) => x?.msg)
      .filter((m) => typeof m === "string" && m.trim());
    if (msgs.length) return msgs.join(" | ");
    return JSON.stringify(d);
  }
  if (d && typeof d === "object") return JSON.stringify(d);
  if (typeof errorData?.message === "string" && errorData.message.trim()) {
    return errorData.message;
  }
  return fallback;
};

export const apiRequest = async (path, options = {}) => {
  // Now buildApiUrl is defined and can be called safely
  const url = buildApiUrl(path);
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetchWithTimeout(url, { ...options, headers });

  const contentType = response.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  }

  if (response.status === 401) {
    throw new Error("401");
  }

  if (!response.ok) {
    const msg = extractErrorMessage(
      data,
      `API Error: ${response.status} ${response.statusText}`,
    );
    console.error("API ERROR", {
      url,
      status: response.status,
      response: data,
    });
    throw new Error(msg);
  }

  if (response.status === 204) return null;
  return data;
};

export const retryRequest = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
};

export const api = {
  get: (path) => apiRequest(path, { method: "GET" }),
  post: (path, data) =>
    apiRequest(path, { method: "POST", body: JSON.stringify(data) }),
  patch: (path, data) =>
    apiRequest(path, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (path) => apiRequest(path, { method: "DELETE" }),
};
