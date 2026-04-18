const BASE_URL = 'https://tarfkhobz.n8n.app.cloud/webhook/appointments';

export const getAppointments = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch appointments');
  return response.json();
};

export const createAppointment = async (appointment) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  });
  if (!response.ok) throw new Error('Failed to create appointment');
  return response.json();
};

export const updateAppointment = async ({ id, ...data }) => {
  // Try to use a trailing slash if n8n expects it, but usually standard REST expects URL + /id
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update appointment');
  return response.json();
};

export const deleteAppointment = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete appointment');
  return response.json();
};
