import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ItemEdit({ open, onClose, item, onSave }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    quantity: item?.quantity || '',
    status: item?.status || '',
    sku: item?.sku || '',
  });

  React.useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        quantity: item.quantity || '',
        status: item.status || '',
        sku: item.sku || '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(form);
  };

  if (!item) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('items.editTitle', 'Editar Item')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label={t('items.editName', 'Nombre')} name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField label={t('items.editDescription', 'Descripción')} name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={2} />
          <TextField label={t('items.price', 'Precio')} name="price" value={form.price} onChange={handleChange} fullWidth type="number" />
          <TextField label={t('items.quantity', 'Cantidad')} name="quantity" value={form.quantity} onChange={handleChange} fullWidth type="number" />
          <TextField label={t('items.status', 'Estado')} name="status" value={form.status} onChange={handleChange} fullWidth />
          <TextField label={t('items.sku', 'SKU')} name="sku" value={form.sku} onChange={handleChange} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel', 'Cancelar')}</Button>
        <Button color="primary" onClick={handleSave}>{t('common.save', 'Guardar')}</Button>
      </DialogActions>
    </Dialog>
  );
}
