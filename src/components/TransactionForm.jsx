import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

const types = [
  { value: 'sale', labelKey: 'transactions.type.sale' },
  { value: 'purchase', labelKey: 'transactions.type.purchase' },
  { value: 'adjustment', labelKey: 'transactions.type.adjustment' },
];

export default function TransactionForm({ initialData, onSubmit, onCancel, loading }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    type: '',
    amount: '',
    date: '',
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        select
        name="type"
        label={t('transactions.type', 'Tipo')}
        value={form.type}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {types.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>{t(opt.labelKey)}</MenuItem>
        ))}
      </TextField>
      <TextField
        name="amount"
        label={t('transactions.amount', 'Monto')}
        type="number"
        value={form.amount}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        name="date"
        label={t('transactions.date', 'Fecha')}
        type="date"
        value={form.date}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
      />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>{t('transactions.save', 'Guardar')}</Button>
        <Button type="button" variant="outlined" color="secondary" onClick={onCancel}>{t('transactions.cancel', 'Cancelar')}</Button>
      </Box>
    </Box>
  );
}
