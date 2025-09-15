import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

const statusOptions = [
  { value: 'active', labelKey: 'projects.status.active' },
  { value: 'completed', labelKey: 'projects.status.completed' },
  { value: 'paused', labelKey: 'projects.status.paused' },
];

export default function ProjectForm({ initialData, onSubmit, onCancel, loading }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    status: '',
    startDate: '',
    endDate: '',
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
        name="name"
        label={t('projects.name', 'Nombre')}
        value={form.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        select
        name="status"
        label={t('projects.status', 'Estado')}
        value={form.status}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        {statusOptions.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>{t(opt.labelKey)}</MenuItem>
        ))}
      </TextField>
      <TextField
        name="startDate"
        label={t('projects.startDate', 'Inicio')}
        type="date"
        value={form.startDate}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField
        name="endDate"
        label={t('projects.endDate', 'Fin')}
        type="date"
        value={form.endDate}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>{t('projects.save', 'Guardar')}</Button>
        <Button type="button" variant="outlined" color="secondary" onClick={onCancel}>{t('projects.cancel', 'Cancelar')}</Button>
      </Box>
    </Box>
  );
}
