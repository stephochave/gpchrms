/**
 * Wrapper for fetch that adds ngrok headers to skip the browser warning page
 * Use this instead of fetch() when making API calls to ngrok URLs
 */
export async function apiFetch(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  
  // Add ngrok header to skip browser warning
  headers.set('ngrok-skip-browser-warning', 'true');
  
  // Add content-type if not set and has body (but not for FormData)
  if (options.body && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Remove Content-Type for FormData to let browser set it with boundary
  if (options.body instanceof FormData && headers.has('Content-Type')) {
    headers.delete('Content-Type');
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}

