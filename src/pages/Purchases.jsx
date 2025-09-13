import React, { useState, useEffect } from 'react';
import PurchaseModal from './PurchaseModal';
import Select from 'react-select';

function PurchaseDetailModal({ purchase, products, suppliers, onClose }) {
  if (!purchase) return null;
  return (
    <Dialog open={!!purchase} onClose={onClose} maxWidth="md">
      <Box sx={{ p: 4, minWidth: 400, position: 'relative' }}>
        <Button onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }} color="inherit">&times;</Button>
        <Typography variant="h6" fontWeight={700} mb={2} align="center">Detalle de Compra</Typography>
        <Typography mb={1}><b>Fecha:</b> {new Date(purchase.fecha_compra).toLocaleDateString()}</Typography>
        <Typography mb={1}><b>Proveedor:</b> {purchase.proveedor_nombre || (suppliers.find(s => s.id === purchase.proveedor_id)?.name || '')}</Typography>
        <Typography mb={1}><b>Método:</b> {purchase.metodo_compra}</Typography>
        <Typography mb={1}><b>Costo Envío:</b> {purchase.costo_envio ? `$${purchase.costo_envio}` : '-'}</Typography>
        <Typography mb={1}><b>Notas:</b> {purchase.notas || '-'}</Typography>
        <Typography mb={1}><b>Artículos:</b></Typography>
        <Box component="ul" mb={2} sx={{ pl: 2 }}>
          {Array.isArray(purchase.items) ? purchase.items.map((a, idx) => (
            <Box component="li" mb={1} key={idx}>
              {a.cantidad} x {products.find(pr => pr.id === a.item_id)?.name || 'Artículo'}
              {a.brand && ` (${a.brand})`}
              {a.model && ` (${a.model})`}
              {a.precio_compra && ` - $${a.precio_compra}`}
              {a.enlace_compra && <a href={a.enlace_compra} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', marginLeft: 8 }}>Enlace</a>}
            </Box>
          )) : null}
        </Box>
        <Typography fontWeight={700} fontSize={18}>Monto total: ${Array.isArray(purchase.items) ? purchase.items.reduce((sum, a) => sum + (parseFloat(a.precio_compra || 0) * parseInt(a.cantidad || 1)), 0).toFixed(2) : '0.00'}</Typography>
      </Box>
    </Dialog>
  );
}

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [detailPurchase, setDetailPurchase] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState('');

  useEffect(() => {
    fetch('/api/store/purchases')
      .then(res => res.json())
      .then(setPurchases)
      .catch(err => {
        setToast({ type: 'error', message: 'Error al obtener compras: ' + err.message });
        setPurchases([]);
      });
    fetch('/api/store/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(err => {
        setToast({ type: 'error', message: 'Error al obtener productos: ' + err.message });
        setProducts([]);
      });
    fetch('/api/suppliers')
      .then(res => res.json())
      .then(setSuppliers)
      .catch(err => {
        setToast({ type: 'error', message: 'Error al obtener proveedores: ' + err.message });
        setSuppliers([]);
      });
  }, []);

  const handlePurchaseSubmit = async (data) => {
    try {
      const res = await fetch('/api/store/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Error al registrar compra');
      setToast({ type: 'success', message: 'Compra registrada correctamente.' });
      setShowModal(false);
      fetch('/api/store/purchases').then(res => res.json()).then(setPurchases);
      fetch('/api/store/products').then(res => res.json()).then(setProducts);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  return (
  <Box sx={{ p: { xs: 2, md: 6 }, mt: { xs: 2, md: 6 }, maxWidth: 1200, mx: 'auto' }}>
      {toast && (
        <Box sx={{ position: 'fixed', top: 48, right: 48, zIndex: 50, px: 4, py: 2, borderRadius: 2, boxShadow: 4, fontWeight: 'bold', bgcolor: toast.type === 'error' ? 'error.main' : 'success.main', color: 'common.white' }}>{toast.message}</Box>
      )}
      <Typography variant="h4" fontWeight={700} mb={4}>Módulo de Compras</Typography>
      <Box sx={{ mb: 4, minWidth: 240 }}>
        <Select
          options={[{ value: '', label: 'Todos los proveedores' }, ...suppliers.map(sup => ({ value: sup.name, label: sup.name }))]}
          value={{ value: selectedSupplier, label: selectedSupplier || 'Todos los proveedores' }}
          onChange={opt => setSelectedSupplier(opt.value)}
          placeholder="Proveedor"
          isClearable
        />
      </Box>
      <Button variant="contained" color="success" sx={{ mb: 4 }} onClick={() => setShowModal(true)}>Registrar Compra</Button>
      {showModal && (
        <PurchaseModal
          items={products}
          suppliers={suppliers}
          onClose={() => setShowModal(false)}
          onSubmit={handlePurchaseSubmit}
        />
      )}
      <Box mt={8}>
        <Typography variant="h6" fontWeight={700} mb={2}>Historial de Compras</Typography>
        <Grid container spacing={2}>
          {purchases
            .filter(p => !selectedSupplier || p.proveedor_nombre === selectedSupplier)
            .map(p => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <Box>
                  <Typography fontWeight={700} fontSize={18} mb={1}>Compra #{p.id}</Typography>
                  <Typography color="text.secondary" fontSize={14} mb={1}>Fecha: {new Date(p.fecha_compra).toLocaleDateString()}</Typography>
                  <Typography color="text.secondary" fontSize={14} mb={1}>Proveedor: {p.proveedor_nombre || (suppliers.find(s => s.id === p.proveedor_id)?.name || '')}</Typography>
                  <Typography color="text.secondary" fontSize={14} mb={1}>Cantidad de artículos: {Array.isArray(p.items) ? p.items.reduce((sum, a) => sum + parseInt(a.cantidad || 1), 0) : 0}</Typography>
                  <Typography color="success.main" fontWeight={700} mb={2}>Monto total: ${Array.isArray(p.items) ? p.items.reduce((sum, a) => sum + (parseFloat(a.precio_compra || 0) * parseInt(a.cantidad || 1)), 0).toFixed(2) : '0.00'}</Typography>
                </Box>
                <CardActions>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setDetailPurchase(p)}>Ver Detalle</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        {detailPurchase && (
          <PurchaseDetailModal
            purchase={detailPurchase}
            products={products}
            suppliers={suppliers}
            onClose={() => setDetailPurchase(null)}
          />
        )}
      </Box>
    </Box>
  );
}
