const BASE_URL = 'https://tarfkhobz.n8n.app.cloud/webhook/doctors';

export const getDoctors = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch doctors');
  return response.json();
};

export const createDoctor = async (doctor) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doctor),
  });
  if (!response.ok) throw new Error('Failed to create doctor');
  return response.json();
};

export const updateDoctor = async ({ id, ...data }) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update doctor');
  return response.json();
};

export const deleteDoctor = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete doctor');
  return response.json();
};
