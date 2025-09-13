export async function getProjects() {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Error al obtener proyectos');
  return res.json();
}

export async function createProject(data) {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al crear proyecto');
  return res.json();
}

export async function updateProject(id, data) {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al editar proyecto');
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar proyecto');
  return res.json();
}
