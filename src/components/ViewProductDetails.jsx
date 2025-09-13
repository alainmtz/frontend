import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Chip, TextField, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getStatus, getStatusColor } from '../pages/Products';

export default function ViewProductDetails({ open, onClose, product }) {
  if (!product) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>Detalles del Producto</Typography>
        <IconButton onClick={onClose} size="large"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {product.image_url ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <img src={`/uploads/${product.image_url}`} alt={product.name} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, border: '2px solid #eee' }} />
            </Box>
          ) : (
            <Box sx={{ width: 120, height: 120, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.500', borderRadius: 2, mb: 2 }}>Sin imagen</Box>
          )}
          <Chip label={product.name || 'Sin nombre'} color="primary" sx={{ mb: 1 }} />
          <Chip label={product.category || 'Sin categoría'} color="info" sx={{ mb: 1 }} />
          <Chip label={product.brand || 'Sin marca'} color="info" sx={{ mb: 1 }} />
          <Chip label={product.model || 'Sin modelo'} color="info" sx={{ mb: 1 }} />
          <Chip label={`Stock: ${product.stock ?? product.quantity ?? 0}`} color="info" sx={{ mb: 1 }} />
          <Chip label={`Estado: ${getStatus(product.stock ?? product.quantity)}`} color={getStatusColor(product.stock ?? product.quantity)} sx={{ mb: 1 }} />
          <Chip label={`Precio: ${typeof product.price === 'number' ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.price) : product.price}`} color="error" sx={{ mb: 1 }} />
          <TextField label="Descripción" name="description" value={product.description || ''} InputProps={{ readOnly: true }} multiline rows={2} size="small" />
          {product.createdAt && (
            <TextField label="Creado" value={new Date(product.createdAt).toLocaleString()} InputProps={{ readOnly: true }} size="small" />
          )}
          {product.updatedAt && (
            <TextField label="Actualizado" value={new Date(product.updatedAt).toLocaleString()} InputProps={{ readOnly: true }} size="small" />
          )}
          {Object.entries(product).map(([key, value]) => (
            ['name','category','brand','model','price','stock','quantity','description','image_url','createdAt','updatedAt'].includes(key) ? null : (
              <TextField key={key} label={key} value={typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)} InputProps={{ readOnly: true }} size="small" />
            )
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
