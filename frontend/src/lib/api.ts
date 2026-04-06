const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data: { full_name: string; email: string; password: string }) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  
  googleAuth: (token: string) =>
    request('/api/auth/google', { method: 'POST', body: JSON.stringify({ token }) }),
};

// ── Transactions ──────────────────────────────────────
export const transactionsAPI = {
  getAll: (params?: { category?: string; search?: string; page?: number }) => {
    const q = new URLSearchParams(params as any).toString();
    return request(`/api/transactions${q ? '?' + q : ''}`);
  },
  create: (data: any) =>
    request('/api/transactions', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/api/transactions/${id}`, { method: 'DELETE' }),
  summary: () => request('/api/transactions/summary'),
};

// ── Budgets ───────────────────────────────────────────
export const budgetsAPI = {
  getAll: () => request('/api/budgets'),
  create: (data: any) =>
    request('/api/budgets', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/api/budgets/${id}`, { method: 'DELETE' }),
};

// ── Goals ─────────────────────────────────────────────
export const goalsAPI = {
  getAll: () => request('/api/goals'),
  create: (data: any) =>
    request('/api/goals', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request(`/api/goals/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/api/goals/${id}`, { method: 'DELETE' }),
};

// ── Cash ──────────────────────────────────────────────
export const cashAPI = {
  getAll: () => request('/api/cash'),
  create: (data: any) =>
    request('/api/cash', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/api/cash/${id}`, { method: 'DELETE' }),
  summary: () => request('/api/cash/summary'),
};

// ── Loans ─────────────────────────────────────────────
export const loansAPI = {
  getAll: () => request('/api/loans'),
  create: (data: any) =>
    request('/api/loans', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/api/loans/${id}`, { method: 'DELETE' }),
};

// ── Analytics ─────────────────────────────────────────
export const analyticsAPI = {
  summary: () => request('/api/analytics/summary'),
  monthly: () => request('/api/analytics/monthly'),
  categories: () => request('/api/analytics/categories'),
};

// ── User ──────────────────────────────────────────────
export const userAPI = {
  me: () => request('/api/users/me'),
  update: (data: any) =>
    request('/api/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
};
