import React, { useEffect, useState } from 'react';
import { getConsumibles, createConsumible, updateConsumible, deleteConsumible } from '../services/consumiblesService';

export default function Consumibles() {
  const [consumibles, setConsumibles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', usage_count: 1, cost_price: '', sale_price: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getConsumibles().then(setConsumibles);
  }, []);

  const handleEdit = (consumible) => {
    setSelected(consumible);
    setEditMode(true);
    setForm({
      name: consumible.name,
      usage_count: consumible.usage_count,
      cost_price: consumible.cost_price,
      sale_price: consumible.sale_price
    });
  };
  const handleDelete = async (consumible) => {
    if (window.confirm('¿Eliminar consumible?')) {
      setLoading(true);
      await deleteConsumible(consumible.id);
      await getConsumibles().then(setConsumibles);
      setSelected(null);
      setLoading(false);
    }
  };
  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFormSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    if (editMode && selected && selected.id) {
      await updateConsumible(selected.id, form);
    } else {
      await createConsumible(form);
    }
    await getConsumibles().then(setConsumibles);
    setEditMode(false);
    setSelected(null);
    setForm({ name: '', usage_count: 1, cost_price: '', sale_price: '' });
    setLoading(false);
  };

  return (
  <Box sx={{ p: { xs: 2, md: 6 }, mt: { xs: 2, md: 6 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={4}>Consumibles</Typography>
      <Button variant="contained" color="success" sx={{ mb: 4 }} onClick={() => { setEditMode(true); setSelected(null); setForm({ name: '', usage_count: 1, cost_price: '', sale_price: '' }); }}>Nuevo Consumible</Button>
      <Grid container spacing={2}>
        {consumibles.map(consumible => (
          <Grid item xs={12} sm={6} md={4} key={consumible.id}>
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography fontWeight={700} fontSize={18} mb={1}>{consumible.name}</Typography>
              <Typography color="text.secondary" fontSize={14} mb={1}>Usos: {consumible.usage_count}</Typography>
              <Typography color="text.secondary" fontSize={14} mb={1}>Costo: ${consumible.cost_price}</Typography>
              <Typography color="text.secondary" fontSize={14} mb={1}>Precio: ${consumible.sale_price}</Typography>
              <CardActions sx={{ mt: 1 }}>
                <Button variant="outlined" color="primary" size="small" onClick={() => handleEdit(consumible)} sx={{ mr: 1 }}>Editar</Button>
                <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(consumible)} disabled={loading}>Eliminar</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Modal de edición/creación */}
      {(selected || editMode) && (
        <Dialog open={!!(selected || editMode)} onClose={() => { setEditMode(false); setSelected(null); }} maxWidth="sm">
          <Box sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleFormSubmit}>
              <Typography variant="h6" fontWeight={700} mb={2}>{selected ? 'Editar Consumible' : 'Nuevo Consumible'}</Typography>
              <TextField name="name" label="Nombre" value={form.name} onChange={handleFormChange} required fullWidth size="small" sx={{ mb: 2 }} />
              <TextField name="usage_count" label="Cantidad de usos" type="number" inputProps={{ min: 1 }} value={form.usage_count} onChange={handleFormChange} required fullWidth size="small" sx={{ mb: 2 }} />
              <TextField name="cost_price" label="Precio de costo" type="number" inputProps={{ min: 0, step: 0.01 }} value={form.cost_price} onChange={handleFormChange} required fullWidth size="small" sx={{ mb: 2 }} />
              <TextField name="sale_price" label="Precio de venta" type="number" inputProps={{ min: 0, step: 0.01 }} value={form.sale_price} onChange={handleFormChange} required fullWidth size="small" sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>Guardar</Button>
                <Button type="button" variant="outlined" color="inherit" onClick={() => { setEditMode(false); setSelected(null); }}>Cancelar</Button>
              </Box>
            </Box>
          </Box>
        </Dialog>
      )}
    </Box>
  );
}
