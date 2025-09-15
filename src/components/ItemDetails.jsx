import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ItemDetails({ open, onClose, item }) {
  const { t } = useTranslation();
  if (!item) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('items.detailsTitle', 'Detalle del Item')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          {item.image_url && (
            <img src={`/uploads/${item.image_url}`} alt={item.name} style={{ width: 220, borderRadius: 8 }} />
          )}
          <Box>
            <Typography variant="h6" color="primary">{item.name}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{item.description}</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2">SKU: {item.sku}</Typography>
            <Typography variant="body2">Precio: ${item.price}</Typography>
            <Typography variant="body2">Cantidad: {item.quantity}</Typography>
            <Typography variant="body2">Estado: {item.status}</Typography>
            {item.supplier_name && <Typography variant="body2">Proveedor: {item.supplier_name}</Typography>}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
