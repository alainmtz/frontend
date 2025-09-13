const API = '/api/consumibles';

export async function getConsumibles() {
  const res = await fetch(API);
  return res.json();
}
