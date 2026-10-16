const AUTH_STORAGE_KEY = "realestateplatform-auth";
const CURRENT_USER_KEY = "realestateplatform-current-user";

export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function getCurrentUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const userData = localStorage.getItem(CURRENT_USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

export function setAuthenticated(user) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("authchange"));
}

export function clearAuthenticated() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event("authchange"));
}
