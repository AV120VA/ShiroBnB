import Cookies from "js-cookie";

export async function csrfFetch(url, options = {}) {
  // Set default method to 'GET' if not provided
  options.method = options.method || "GET";

  // Initialize headers if not provided
  options.headers = options.headers || {};

  // If the method is not 'GET', set 'Content-Type' and 'X-XSRF-TOKEN' headers
  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";

    // Retrieve CSRF token from cookies
    const csrfToken = Cookies.get("XSRF-TOKEN");

    if (csrfToken) {
      options.headers["X-XSRF-TOKEN"] = csrfToken;
    } else {
      console.warn("CSRF token is missing");
    }
  }

  try {
    // Perform the fetch request with the provided URL and options
    const res = await window.fetch(url, options);

    // Throw an error if the response status code is 400 or above
    if (res.status >= 400) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    // Return the response if successful
    return res;
  } catch (error) {
    // Log and rethrow the error for handling in the calling code
    console.error("Fetch error:", error);
    throw error;
  }
}

// Call this function to get the CSRF token and set it in cookies (useful in development)
export function restoreCSRF() {
  return csrfFetch("/api/csrf/restore");
}
