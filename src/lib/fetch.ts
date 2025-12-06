/**
 * Wrapper for fetch that adds ngrok headers to skip the browser warning page
 * Use this instead of fetch() when making API calls to ngrok URLs
 */
export async function apiFetch(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  
  // Add ngrok header to skip browser warning
  headers.set('ngrok-skip-browser-warning', 'true');
  
  // Add content-type if not set and has body
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}

