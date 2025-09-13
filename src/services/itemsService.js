export async function getItems() {
  const res = await fetch('/api/items');
  if (!res.ok) throw new Error('Error al obtener items');
  return res.json();
}

export async function deleteItem(id) {
  const res = await fetch(`/api/items/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar item');
  return res.json();
}

export async function updateItem(id, data) {
  const res = await fetch(`/api/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al editar item');
  return res.json();
}

export async function createItem(data) {
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al crear item');
  return res.json();
}

export async function uploadItemImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/items/upload', {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Error al subir imagen');
  return res.json();
}
