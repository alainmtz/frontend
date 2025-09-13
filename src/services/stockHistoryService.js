export async function getStockHistory() {
  const res = await fetch('/api/stock-history');
  if (!res.ok) throw new Error('Error al obtener stock history');
  return res.json();
}
