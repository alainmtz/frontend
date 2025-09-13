export async function getItems() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/items', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (res.status === 401 || res.status === 403) {
    alert('Sesión expirada o permisos insuficientes. Por favor, inicia sesión nuevamente.');
    localStorage.removeItem('token');
    window.location.href = '/login';
    return [];
  }
  if (!res.ok) throw new Error('Error al obtener items');
  return res.json();
}

export async function deleteItem(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/items/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (res.status === 401 || res.status === 403) {
    alert('Sesión expirada o permisos insuficientes. Por favor, inicia sesión nuevamente.');
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
  if (!res.ok) throw new Error('Error al eliminar item');
  return res.json();
}

export async function updateItem(id, data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (res.status === 401 || res.status === 403) {
    alert('Sesión expirada o permisos insuficientes. Por favor, inicia sesión nuevamente.');
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
  if (!res.ok) throw new Error('Error al editar item');
  return res.json();
}

export async function createItem(data) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (res.status === 401 || res.status === 403) {
    alert('Sesión expirada o permisos insuficientes. Por favor, inicia sesión nuevamente.');
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
  if (!res.ok) throw new Error('Error al crear item');
  return res.json();
}

export async function uploadItemImage(file) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/items/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  if (res.status === 401 || res.status === 403) {
    alert('Sesión expirada o permisos insuficientes. Por favor, inicia sesión nuevamente.');
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
  if (!res.ok) throw new Error('Error al subir imagen');
  return res.json();
}
