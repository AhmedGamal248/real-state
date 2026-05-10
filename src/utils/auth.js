const AUTH_STORAGE_KEY = "realestateplatform-auth";

export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function setAuthenticated(value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, value ? "true" : "false");
  window.dispatchEvent(new Event("authchange"));
}

export function clearAuthenticated() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event("authchange"));
}
