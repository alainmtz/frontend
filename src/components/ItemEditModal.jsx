
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Grid, TextField, Typography, Chip, IconButton } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const ItemEditModal = ({ item, open, onClose, onChange, onSubmit, loading, previewImg, onFileChange, onDragOver, triggerFileInput, addFileInputRef }) => {
  if (!item) return null;
  const formatPrice = price => typeof price === 'number' ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price) : price;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight={700}>Editar {item.name}</Typography>
            <Chip label={item.supplier_name || 'Sin proveedor'} color="secondary" size="small" />
          </Box>
          <IconButton onClick={onClose} color="error" size="small" aria-label="Cerrar">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Box
                sx={{ width: '100%', height: 192, border: '2px dashed', borderColor: 'grey.400', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 2, boxShadow: 2 }}
                onDrop={onDragOver}
                onDragOver={onDragOver}
                onClick={triggerFileInput}
              >
                {previewImg ? (
                  <img src={previewImg} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }} />
                ) : (
                  <Typography color="text.secondary">Arrastra y suelta o haz clic para subir imagen</Typography>
                )}
                <input type="file" accept="image/*" style={{ display: 'none' }} ref={addFileInputRef} onChange={onFileChange} />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip label={item.sku || 'Sin SKU'} size="small" />
                  <Chip label={item.brand || 'Sin marca'} size="small" color="info" />
                  <Chip label={item.model || 'Sin modelo'} size="small" color="info" />
                  <Chip label={item.provenance || 'Sin procedencia'} size="small" color="default" />
                  <Chip label={item.warranty_days ? `Garantía: ${item.warranty_days} días` : 'Sin garantía'} size="small" color="default" />
                </Box>
                <TextField label="Nombre" name="name" value={item.name || ''} onChange={onChange} required size="small" />
                <TextField label="SKU" name="sku" value={item.sku || ''} onChange={onChange} required size="small" />
                <TextField label="Precio" name="price" type="number" inputProps={{ min: 0, step: 0.01 }} value={item.price || ''} onChange={onChange} required size="small" />
                <TextField label="Costo" name="cost" type="number" inputProps={{ min: 0, step: 0.01 }} value={item.cost || ''} onChange={onChange} size="small" />
                <TextField label="Cantidad (Stock)" name="quantity" type="number" inputProps={{ min: 0 }} value={item.quantity || 0} onChange={onChange} required size="small" />
                <TextField label="Marca" name="brand" value={item.brand || ''} onChange={onChange} size="small" />
                <TextField label="Modelo" name="model" value={item.model || ''} onChange={onChange} size="small" />
                <TextField label="Proveedor" name="supplier_name" value={item.supplier_name || ''} onChange={onChange} size="small" />
                <TextField label="Procedencia" name="provenance" value={item.provenance || ''} onChange={onChange} size="small" />
                <TextField label="Garantía (días)" name="warranty_days" type="number" inputProps={{ min: 0 }} value={item.warranty_days || ''} onChange={onChange} size="small" />
                <TextField label="Descripción" name="description" value={item.description || ''} onChange={onChange} multiline rows={2} size="small" />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" type="submit" startIcon={<SaveIcon />} disabled={loading}>{loading ? 'Guardando...' : 'Guardar Cambios'}</Button>
          <Button variant="outlined" color="inherit" onClick={onClose} startIcon={<CloseIcon />} disabled={loading}>Cancelar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ItemEditModal;
