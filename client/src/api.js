// Thin wrapper around fetch. All requests go to /api (proxied to Express in dev).
const BASE = '/api/tasks';

async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the API running?');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok) {
    const detail = data?.errors?.length ? data.errors.join('. ') : data?.message;
    throw new Error(detail || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  list: ({ status = 'All', search = '' } = {}) => {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.set('status', status);
    if (search) params.set('search', search);
    const qs = params.toString();
    return request(qs ? `${BASE}?${qs}` : BASE);
  },
  create: (task) => request(BASE, { method: 'POST', body: JSON.stringify(task) }),
  update: (id, task) => request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
  remove: (id) => request(`${BASE}/${id}`, { method: 'DELETE' }),
};
