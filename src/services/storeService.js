export async function purchaseCart(data) {
  // data debe ser { cart, cliente }
  const res = await fetch('/api/store/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al procesar la compra');
  return res.json();
}
