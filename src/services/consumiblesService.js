const API = '/api/consumibles';

async function safeJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export async function getConsumibles() {
  const res = await fetch(API);
  return await safeJson(res);
}

export async function createConsumible(data) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await safeJson(res);
}

export async function updateConsumible(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await safeJson(res);
}

export async function deleteConsumible(id) {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE'
  });
  return await safeJson(res);
}
