const BASE_URL = 'http://localhost:5000/api/v1';

function getTokens() {
  try {
    const stored = localStorage.getItem('tokens');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setTokens(tokens) {
  localStorage.setItem('tokens', JSON.stringify(tokens));
}

export function clearTokens() {
  localStorage.removeItem('tokens');
}

export function isAuthenticated() {
  return !!getTokens();
}

async function request(endpoint, options = {}) {
  const tokens = getTokens();
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (tokens?.accessToken) {
    headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  let res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (res.status === 401 && tokens?.refreshToken && !endpoint.includes('/auth/')) {
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      setTokens(data.data);
      headers.Authorization = `Bearer ${data.data.accessToken}`;
      res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    } else {
      clearTokens();
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (url, body) => request(url, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url) => request(url, { method: 'DELETE' }),
};
