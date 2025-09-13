
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Grid, Typography, Chip, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const ItemDetailsModal = ({ item, open, onClose }) => {
  if (!item) return null;
  const formatPrice = price => typeof price === 'number' ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price) : price;
  const formatDate = date => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date.replace(' ', 'T')) : new Date(date);
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight={700}>{item.name}</Typography>
          <Chip label={item.supplier_name ? `Proveedor: ${item.supplier_name}` : 'Sin proveedor'} color="secondary" size="small" />
        </Box>
        <IconButton onClick={onClose} color="error" size="small" aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 3fr' }, gap: 3 }}>
          <Box>
            {item.image_url ? (
              <Box sx={{ width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: 2, overflow: 'hidden', boxShadow: 3, border: '2px solid', borderColor: 'grey.300' }}>
                <img src={`/uploads/${item.image_url}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
              </Box>
            ) : (
              <Box sx={{ width: '100%', height: 220, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.500', borderRadius: 2, boxShadow: 1 }}>
                Sin imagen
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 0 }}>
            <Typography variant="body2" color="success.main" fontWeight={700}>Precio: {formatPrice(item.price)}</Typography>
            <Typography variant="body2" color="info.main">Costo: {item.cost ? formatPrice(item.cost) : '-'}</Typography>
            <Typography variant="body2" color="text.secondary">Stock: <b>{typeof item.quantity !== 'undefined' ? item.quantity : '-'}</b></Typography>
            <Chip label={item.quantity > 0 ? (item.quantity < 5 ? 'Bajo stock' : 'Disponible') : 'Agotado'} color={item.quantity > 0 ? (item.quantity < 5 ? 'warning' : 'success') : 'error'} size="small" sx={{ my: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{item.description || 'Sin descripción'}</Typography>
            <Typography variant="body2" color="text.secondary">ID: {item.id}</Typography>
            <Typography variant="body2" color="text.secondary">Modelo: {item.model || '-'}</Typography>
            <Typography variant="body2" color="text.secondary">Marca: {item.brand || '-'}</Typography>
            <Typography variant="body2" color="text.secondary">Procedencia: {item.provenance || '-'}</Typography>
            <Typography variant="body2" color="text.secondary">Garantía: {item.warranty_days || 0} días</Typography>
            <Typography variant="caption" color="grey.600">Creado: {formatDate(item.created_at)}</Typography>
            <Typography variant="caption" color="grey.600">Actualizado: {formatDate(item.updated_at)}</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={item.sku || 'Sin SKU'} size="small" />
              <Chip label={item.brand || 'Sin marca'} size="small" color="info" />
              <Chip label={item.model || 'Sin modelo'} size="small" color="info" />
              <Chip label={item.provenance || 'Sin procedencia'} size="small" color="default" />
              <Chip label={item.warranty_days ? `Garantía: ${item.warranty_days} días` : 'Sin garantía'} size="small" color="default" />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose} startIcon={<CloseIcon />}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDetailsModal;
