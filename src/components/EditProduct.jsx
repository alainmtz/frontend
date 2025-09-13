import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Chip, TextField, Typography, IconButton, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

export default function EditProduct({ open, onClose, product, onChange, onSubmit, loading }) {
  if (!product) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <form onSubmit={onSubmit}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>Editar Producto</Typography>
          <IconButton onClick={onClose} size="large"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Chip label={product.name || ''} color="primary" sx={{ mb: 1 }} />
            <Chip label={product.category || 'Sin categoría'} color="info" sx={{ mb: 1 }} />
            <Chip label={`Stock: ${product.stock || 0}`} color="info" sx={{ mb: 1 }} />
            <Chip label={`PRECIO: ${typeof product.price === 'number' ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.price) : product.price}`} color="error" sx={{ mb: 1 }} />
            <TextField label="Nombre" name="name" value={product.name || ''} onChange={onChange} required size="small" />
            <TextField label="Categoría" name="category" value={product.category || ''} onChange={onChange} size="small" />
            <TextField label="Precio" name="price" type="number" inputProps={{ min: 0, step: 0.01 }} value={product.price || ''} onChange={onChange} required size="small" />
            <TextField label="Stock" name="stock" type="number" inputProps={{ min: 0 }} value={product.stock || ''} onChange={onChange} required size="small" />
            <TextField label="Descripción" name="description" value={product.description || ''} onChange={onChange} multiline rows={2} size="small" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button variant="contained" color="primary" type="submit" startIcon={<SaveIcon />} disabled={loading}>Guardar</Button>
          <Button variant="outlined" color="inherit" onClick={onClose}>Cancelar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
