export async function getTransactions() {
  const res = await fetch('/api/transactions');
  if (!res.ok) throw new Error('Error al obtener transactions');
  return res.json();
}
