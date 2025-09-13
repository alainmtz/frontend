export async function getSuppliers() {
  const res = await fetch('/api/suppliers');
  if (!res.ok) throw new Error('Error al obtener suppliers');
  return res.json();
}

export async function deleteSupplier(id) {
  const res = await fetch(`/api/suppliers/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar proveedor');
  return res.json();
}

export async function updateSupplier(id, data) {
  const res = await fetch(`/api/suppliers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al editar proveedor');
  return res.json();
}
