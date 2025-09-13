export async function getProducts() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/store/products', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Error al obtener items');
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`/api/items/${id}`);
  if (!res.ok) throw new Error('Error al obtener item');
  return res.json();
}

export async function createProduct(data) {
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al crear item');
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(`/api/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al actualizar item');
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`/api/items/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar item');
  return res.json();
}
