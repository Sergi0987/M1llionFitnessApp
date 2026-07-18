const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getSession() {
  return JSON.parse(localStorage.getItem('m1_session') || 'null');
}

export function saveSession(session) {
  localStorage.setItem('m1_session', JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem('m1_session');
}

export async function apiRequest(path, options = {}) {
  const session = getSession();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const authApi = {
  login: (payload) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  changePassword: (payload) =>
    apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export const adminApi = {
  clients: () => apiRequest('/admin/clients'),
  createClient: (payload) =>
    apiRequest('/admin/clients', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  client: (id) => apiRequest(`/admin/clients/${id}`),
  updateClient: (id, payload) =>
    apiRequest(`/admin/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteClient: (id) =>
    apiRequest(`/admin/clients/${id}`, {
      method: 'DELETE',
    }),
  resetClientPassword: (id, password) =>
    apiRequest(`/admin/clients/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    }),
  addCheckin: (id, payload) =>
    apiRequest(`/admin/clients/${id}/checkins`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  assignProgram: (id, programId) =>
    apiRequest(`/admin/clients/${id}/programs`, {
      method: 'POST',
      body: JSON.stringify({ program_id: programId }),
    }),
  addClientNote: (id, note) =>
    apiRequest(`/admin/clients/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),
  programs: () => apiRequest('/admin/programs'),
  program: (id) => apiRequest(`/admin/programs/${id}`),
  createProgram: (payload) =>
    apiRequest('/admin/programs', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateProgram: (id, payload) =>
    apiRequest(`/admin/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  addProgramWorkout: (id, payload) =>
    apiRequest(`/admin/programs/${id}/workouts`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteProgramWorkout: (programId, workoutId) =>
    apiRequest(`/admin/programs/${programId}/workouts/${workoutId}`, {
      method: 'DELETE',
    }),
};

export const portalApi = {
  home: () => apiRequest('/portal'),
  addCheckin: (payload) =>
    apiRequest('/portal/checkins', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  workouts: () => apiRequest('/workouts'),
  createWorkout: (payload) =>
    apiRequest('/workouts', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteWorkout: (id) =>
    apiRequest(`/workouts/${id}`, {
      method: 'DELETE',
    }),
};
