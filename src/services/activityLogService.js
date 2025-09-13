export async function getActivityLog() {
  const res = await fetch('/api/activity-log');
  if (!res.ok) throw new Error('Error al obtener activity log');
  return res.json();
}
