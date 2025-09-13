import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/productsService';
import StoreCart from './StoreCart';
import { Box, Grid, Card, CardContent, CardActions, Button, Typography, Dialog, DialogContent } from '@mui/material';
import { MdAddShoppingCart } from 'react-icons/md';
import PurchaseModal from './PurchaseModal';
import Select from 'react-select';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [zoomImg, setZoomImg] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [toast, setToast] = useState(null);

  const [selectedSupplier, setSelectedSupplier] = useState('');
  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(err => {
        setToast({ type: 'error', message: 'Error al obtener productos: ' + err.message });
        setProducts([]);
      });
    fetch('/api/suppliers', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(async res => {
        if (res.status === 401 || res.status === 403) {
          alert('Sesión expirada o permisos insuficientes. Por favor, inicia sesión nuevamente.');
          localStorage.removeItem('token');
          window.location.href = '/login';
          return [];
        }
        const data = await res.json();
        setSuppliers(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        setToast({ type: 'error', message: 'Error al obtener proveedores: ' + err.message });
        setSuppliers([]);
      });
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id);
      if (found) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handlePurchaseSubmit = async (data) => {
    try {
      const res = await fetch('/api/store/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Error al registrar compra');
      setToast({ type: 'success', message: 'Compra registrada correctamente.' });
      setShowPurchaseModal(false);
      getProducts().then(setProducts);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  return (
  <Box sx={{ p: { xs: 2, md: 6 }, mt: { xs: 2, md: 6 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Toast de mensajes */}
      {toast && (
        <Box sx={{ position: 'fixed', top: 48, right: 48, zIndex: 50, px: 4, py: 2, borderRadius: 2, boxShadow: 4, fontWeight: 'bold', bgcolor: toast.type === 'error' ? 'error.main' : 'success.main', color: 'common.white' }}>{toast.message}</Box>
      )}
      <Typography variant="h4" fontWeight={700} mb={4}>Tienda Virtual</Typography>
      <Box sx={{ mb: 4, minWidth: 240 }}>
        <Select
          options={[{ value: '', label: 'Todos los proveedores' }, ...suppliers.map(sup => ({ value: sup.name, label: sup.name }))]}
          value={{ value: selectedSupplier, label: selectedSupplier || 'Todos los proveedores' }}
          onChange={opt => setSelectedSupplier(opt.value)}
          placeholder="Proveedor"
          isClearable
        />
      </Box>
      {/* Eliminar el botón de compras aquí */}
      {/* <button className="bg-green-600 text-white px-4 py-2 rounded mb-4" onClick={() => setShowPurchaseModal(true)}>Registrar Compra</button> */}
      {showPurchaseModal && (
        <PurchaseModal
          items={products}
          suppliers={suppliers}
          onClose={() => setShowPurchaseModal(false)}
          onSubmit={handlePurchaseSubmit}
        />
      )}
      {/* Botón flotante para ver el carrito */}
        <Box sx={{ position: 'fixed', bottom: 48, right: 48, bgcolor: 'primary.main', color: 'common.white', px: 6, py: 3, borderRadius: '50px', boxShadow: 4, display: 'flex', alignItems: 'center', gap: 2, zIndex: 50, cursor: 'pointer', '&:hover': { bgcolor: 'primary.dark' } }} onClick={() => setShowCart(true)}>
          <MdAddShoppingCart size={24} />
          <Typography fontWeight={700}>Ver Carrito</Typography>
          <Box sx={{ ml: 2, bgcolor: 'common.white', color: 'primary.main', borderRadius: '50px', px: 2, py: 0.5, fontSize: 12, fontWeight: 700 }}>{cart.reduce((sum, p) => sum + p.quantity, 0)}</Box>
          <Box sx={{ ml: 2, bgcolor: 'green.100', color: 'green.700', borderRadius: '50px', px: 3, py: 0.5, fontSize: 12, fontWeight: 700 }}>${cart.reduce((total, p) => total + p.price * p.quantity, 0).toFixed(2)}</Box>
        </Box>
      <Grid container spacing={2}>
        {products
          .filter(product => !selectedSupplier || product.supplier_name === selectedSupplier)
          .map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Box sx={{ width: 64, height: 64, bgcolor: 'grey.200', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, overflow: 'hidden', cursor: 'pointer' }} onClick={() => product.image_url && setZoomImg(`/uploads/${product.image_url}`)}>
                {product.image_url ? (
                  <img src={`/uploads/${product.image_url}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Typography color="text.secondary" fontWeight={700} fontSize={32}>{product.name[0]}</Typography>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700} fontSize={18}>{product.name}</Typography>
                <Typography color="text.secondary" fontSize={14} mb={1}>{product.description}</Typography>
                <Typography color="success.main" fontWeight={700} mb={1}>${product.price}</Typography>
                <Typography color="text.secondary" fontSize={14} mb={1}>Cantidad disponible: <b>{product.quantity}</b></Typography>
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ px: 1, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 700, bgcolor: product.quantity > 0 ? (product.quantity < 5 ? 'yellow.100' : 'green.100') : 'red.100', color: product.quantity > 0 ? (product.quantity < 5 ? 'yellow.700' : 'green.700') : 'red.700', display: 'inline-block' }}>Estado: {product.quantity > 0 ? (product.quantity < 5 ? 'Bajo stock' : 'Disponible') : 'Agotado'}</Box>
                </Box>
              </Box>
              <CardActions sx={{ flexDirection: 'column', gap: 1, ml: 2 }}>
                <Button variant="contained" color="success" size="small" onClick={() => addToCart(product)} startIcon={<MdAddShoppingCart size={20} />}></Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {showCart && <StoreCart cart={cart} setCart={setCart} setShowCart={setShowCart} />}
      {zoomImg && (
        <Dialog open={!!zoomImg} onClose={() => setZoomImg(null)} maxWidth="md">
          <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.6)' }}>
            <img src={zoomImg} alt="Zoom" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8, boxShadow: 8 }} />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}
