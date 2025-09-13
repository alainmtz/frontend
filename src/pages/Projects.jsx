import React, { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../services/projectsService';
import { getItems } from '../services/itemsService';
import { getConsumibles } from '../services/consumiblesService';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);
  const [consumibles, setConsumibles] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', labor_cost: 0, items: [], consumibles: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProjects()
      .then(data => Array.isArray(data) ? setProjects(data) : setProjects([]))
      .catch(err => { setError('Error al obtener proyectos'); setProjects([]); });
    getItems()
      .then(data => Array.isArray(data) ? setItems(data) : setItems([]))
      .catch(err => { setError('Error al obtener items'); setItems([]); });
    getConsumibles()
      .then(data => Array.isArray(data) ? setConsumibles(data) : setConsumibles([]))
      .catch(err => { setError('Error al obtener consumibles'); setConsumibles([]); });
  }, []);

  const handleAddItem = () => {
    setForm({ ...form, items: [...form.items, { item_id: '', quantity: 1 }] });
  };
  const handleItemChange = (idx, field, value) => {
    const newItems = form.items.map((it, i) => i === idx ? { ...it, [field]: value } : it);
    setForm({ ...form, items: newItems });
  };
  const handleRemoveItem = idx => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  };

  // Consumibles en el formulario
  const handleAddConsumible = () => {
    setForm({ ...form, consumibles: [...(form.consumibles || []), { consumible_id: '', quantity_used: 1 }] });
  };
  const handleConsumibleChange = (idx, field, value) => {
    const newConsumibles = (form.consumibles || []).map((c, i) => i === idx ? { ...c, [field]: value } : c);
    setForm({ ...form, consumibles: newConsumibles });
  };
  const handleRemoveConsumible = idx => {
    setForm({ ...form, consumibles: (form.consumibles || []).filter((_, i) => i !== idx) });
  };

  const handleEdit = (project) => {
    setSelected(project);
    setEditMode(true);
    setForm({
      name: project.name,
      description: project.description,
      labor_cost: project.labor_cost || 0,
      items: project.projectItems ? project.projectItems.map(pi => ({ item_id: pi.item_id, quantity: pi.quantity })) : [],
      consumibles: project.projectConsumables ? project.projectConsumables.map(pc => ({ consumible_id: pc.consumible_id, quantity_used: pc.quantity_used })) : []
    });
  };
  const handleDetails = (project) => {
    setSelected(project);
    setEditMode(false);
  };
  const handleDelete = async (project) => {
    if (window.confirm('¿Eliminar proyecto?')) {
      setLoading(true);
      await deleteProject(project.id);
      await getProjects().then(setProjects);
      setSelected(null);
      setLoading(false);
    }
  };
  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
  };
  const handleFormSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    if (editMode && selected && selected.id) {
      await updateProject(selected.id, form);
    } else {
      await createProject(form);
    }
    await getProjects().then(setProjects);
    setEditMode(false);
    setSelected(null);
    setForm({ name: '', description: '', labor_cost: 0, items: [], consumibles: [] });
    setLoading(false);
  };

  // Calcular el costo total dinámico del formulario (items + consumibles)
  const totalConsumibles = Array.isArray(form.consumibles)
    ? form.consumibles.reduce((sum, c) => {
        const consumible = Array.isArray(consumibles) ? consumibles.find(i => i.id === Number(c.consumible_id)) : null;
        return sum + ((consumible?.sale_price ? (consumible.sale_price / (consumible.usage_count || 1)) : 0) * (Number(c.quantity_used) || 0));
      }, 0)
    : 0;
  const totalCost = Array.isArray(form.items)
    ? form.items.reduce((sum, it) => {
        const item = Array.isArray(items) ? items.find(i => i.id === Number(it.item_id)) : null;
        return sum + ((item?.price || 0) * (Number(it.quantity) || 0));
      }, 0) + totalConsumibles + (Number(form.labor_cost) || 0)
    : totalConsumibles + (Number(form.labor_cost) || 0);

  return (
  <Box sx={{ p: { xs: 2, md: 6 }, mt: { xs: 2, md: 6 }, maxWidth: 1200, mx: 'auto' }}>
      {error && <Box sx={{ bgcolor: 'error.light', color: 'error.main', p: 2, mb: 4, borderRadius: 2 }}>{error}</Box>}
      <Typography variant="h4" fontWeight={700} mb={4}>Proyectos Creativos</Typography>
      <Button variant="contained" color="success" sx={{ mb: 4 }} onClick={() => { setEditMode(true); setSelected(null); setForm({ name: '', description: '', labor_cost: 0, items: [], consumibles: [] }); }}>Nuevo Proyecto</Button>
      <Grid container spacing={2}>
        {projects.map(project => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography fontWeight={700} fontSize={18} mb={1}>{project.name}</Typography>
              <Typography color="text.secondary" fontSize={14} mb={1}>{project.description}</Typography>
              <Typography color="text.secondary" fontSize={14} mb={1}>ID: {project.id}</Typography>
              <Typography color="text.secondary" fontSize={14} mb={1}>Items usados: {Array.isArray(project.projectItems) ? project.projectItems.length : 0}</Typography>
              <Typography color="text.secondary" fontSize={14} mb={1}>Consumibles usados: {Array.isArray(project.projectConsumibles) ? project.projectConsumibles.length : 0}</Typography>
              <Typography color="success.main" fontWeight={700} mb={1}>
                Costo total USD: ${typeof project.total_cost === 'number'
                  ? project.total_cost.toFixed(2)
                  : (() => {
                      let totalItems = Array.isArray(project.projectItems)
                        ? project.projectItems.reduce((sum, pi) => sum + ((pi.unit_price || 0) * (pi.quantity || 0)), 0)
                        : 0;
                      let totalConsumibles = Array.isArray(project.projectConsumibles)
                        ? project.projectConsumibles.reduce((sum, pc) => {
                            if (pc.consumible?.sale_price && pc.consumible?.usage_count && pc.quantity_used) {
                              return sum + ((pc.consumible.sale_price / pc.consumible.usage_count) * pc.quantity_used);
                            }
                            return sum;
                          }, 0)
                        : 0;
                      return (totalItems + totalConsumibles + (Number(project.labor_cost) || 0)).toFixed(2);
                    })()}
              </Typography>
              <CardActions sx={{ mt: 1 }}>
                <Button variant="outlined" color="info" size="small" onClick={() => handleDetails(project)} sx={{ mr: 1 }}>Detalles</Button>
                          <Button variant="outlined" color="primary" size="small" onClick={() => handleEdit(project)} sx={{ mr: 1 }}>Editar</Button>
                          <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(project)} disabled={loading}>Eliminar</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                {/* Modal de detalles/edición */}
                {(selected || editMode) && (
                  <Dialog open={!!(selected || editMode)} onClose={() => { setEditMode(false); setSelected(null); }} maxWidth="md">
                    <Box sx={{ p: 4 }}>
                      {editMode ? (
                        <Box component="form" onSubmit={handleFormSubmit}>
                          <Typography variant="h6" fontWeight={700} mb={2}>{selected ? 'Editar Proyecto' : 'Nuevo Proyecto'}</Typography>
                          <TextField name="name" label="Nombre" value={form.name} onChange={handleFormChange} required fullWidth size="small" sx={{ mb: 2 }} />
                          <TextField name="description" label="Descripción" value={form.description} onChange={handleFormChange} multiline rows={2} fullWidth size="small" sx={{ mb: 2 }} />
                          <TextField name="labor_cost" label="Costo mano de obra (USD)" type="number" inputProps={{ min: 0, step: 0.01 }} value={form.labor_cost} onChange={handleFormChange} fullWidth size="small" sx={{ mb: 2 }} />
                          <Typography fontWeight={700} mt={2}>Items usados</Typography>
                          {form.items.map((it, idx) => (
                            <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                              <TextField select label="Item" value={it.item_id} onChange={e => handleItemChange(idx, 'item_id', e.target.value)} size="small" sx={{ flex: 1 }} SelectProps={{ native: true }}>
                                <option value="">Selecciona item</option>
                                {items.map(item => (
                                  <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                              </TextField>
                              <TextField type="number" label="Cantidad" inputProps={{ min: 1 }} value={it.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} size="small" sx={{ width: 80 }} />
                              <Button type="button" variant="outlined" color="error" size="small" onClick={() => handleRemoveItem(idx)}>Quitar</Button>
                            </Box>
                          ))}
                          <Button type="button" variant="outlined" color="primary" size="small" sx={{ mt: 1 }} onClick={handleAddItem}>Agregar item</Button>
                          <Typography fontWeight={700} mt={2}>Consumibles usados</Typography>
                          {(form.consumibles || []).map((c, idx) => (
                            <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                              <TextField select label="Consumible" value={c.consumible_id} onChange={e => handleConsumibleChange(idx, 'consumible_id', e.target.value)} size="small" sx={{ flex: 1 }} SelectProps={{ native: true }}>
                                <option value="">Selecciona consumible</option>
                                {consumibles.map(consumible => (
                                  <option key={consumible.id} value={consumible.id}>{consumible.name}</option>
                                ))}
                              </TextField>
                              <TextField type="number" label="Cantidad usada" inputProps={{ min: 1 }} value={c.quantity_used} onChange={e => handleConsumibleChange(idx, 'quantity_used', e.target.value)} size="small" sx={{ width: 80 }} />
                              <Button type="button" variant="outlined" color="error" size="small" onClick={() => handleRemoveConsumible(idx)}>Quitar</Button>
                            </Box>
                          ))}
                          <Button type="button" variant="outlined" color="primary" size="small" sx={{ mt: 1 }} onClick={handleAddConsumible}>Agregar consumible</Button>
                          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button type="submit" variant="contained" color="primary" disabled={loading}>Guardar</Button>
                            <Button type="button" variant="outlined" color="inherit" onClick={() => { setEditMode(false); setSelected(null); }}>Cancelar</Button>
                          </Box>
                          <Typography color="success.main" fontWeight={700} mt={2}>Costo total: ${totalCost.toFixed(2)}</Typography>
                        </Box>
                      ) : (
                        <>
                          <Typography variant="h6" fontWeight={700} mb={2}>Detalles del Proyecto</Typography>
                          <Typography mb={1}><b>ID:</b> {selected.id}</Typography>
                          <Typography mb={1}><b>Nombre:</b> {selected.name}</Typography>
                          <Typography mb={1}><b>Descripción:</b> {selected.description}</Typography>
                          <Typography mb={1}><b>Fecha de creación:</b> {selected.created_at ? new Date(selected.created_at).toLocaleString() : '-'}</Typography>
                          <Typography mb={1}><b>Última modificación:</b> {selected.updated_at ? new Date(selected.updated_at).toLocaleString() : '-'}</Typography>
                          <Typography fontWeight={700} mt={2}>Items usados:</Typography>
                          <Box component="ul" mb={2} sx={{ pl: 2 }}>
                            {Array.isArray(selected.projectItems) && selected.projectItems.length > 0 ? (
                              selected.projectItems.map((pi, idx) => (
                                <Box component="li" mb={1} key={idx}>
                                  {pi.item?.name || 'Item'} x {pi.quantity} (${pi.unit_price} c/u, costo: {(pi.unit_price * pi.quantity).toFixed(2)})
                                </Box>
                              ))
                            ) : (
                              <Box component="li" color="text.secondary" fontSize={14}>No hay items usados</Box>
                            )}
                          </Box>
                          <Typography fontWeight={700} mt={2}>Consumibles usados:</Typography>
                          <Box component="ul" mb={2} sx={{ pl: 2 }}>
                            {Array.isArray(selected.projectConsumibles) && selected.projectConsumibles.length > 0 ? (
                              selected.projectConsumibles.map((pc, idx) => (
                                <Box component="li" mb={1} key={idx}>
                                  {pc.consumible?.name || 'Consumible'} x {pc.quantity_used} ({(pc.consumible?.sale_price && pc.consumible?.usage_count)
                                    ? (pc.consumible.sale_price / pc.consumible.usage_count).toFixed(2)
                                    : '0.00'} c/u, costo total: {(pc.consumible?.sale_price && pc.consumible?.usage_count && pc.quantity_used)
                                    ? ((pc.consumible.sale_price / pc.consumible.usage_count) * pc.quantity_used).toFixed(2)
                                    : '0.00'})
                                </Box>
                              ))
                            ) : (
                              <Box component="li" color="text.secondary" fontSize={14}>No hay consumibles usados</Box>
                            )}
                          </Box>
                          <Typography mb={1}><b>Costo mano de obra:</b> ${selected.labor_cost ? Number(selected.labor_cost).toFixed(2) : '0.00'}</Typography>
                          <Typography color="success.main" fontWeight={700} mb={2}>
                            Costo total: ${typeof selected.total_cost === 'number'
                              ? selected.total_cost.toFixed(2)
                              : (() => {
                                  let totalItems = Array.isArray(selected.projectItems)
                                    ? selected.projectItems.reduce((sum, pi) => sum + ((pi.unit_price || 0) * (pi.quantity || 0)), 0)
                                    : 0;
                                  let totalConsumibles = Array.isArray(selected.projectConsumibles)
                                    ? selected.projectConsumibles.reduce((sum, pc) => {
                                        if (pc.consumible?.sale_price && pc.consumible?.usage_count && pc.quantity_used) {
                                          return sum + ((pc.consumible.sale_price / pc.consumible.usage_count) * pc.quantity_used);
                                        }
                                        return sum;
                                      }, 0)
                                    : 0;
                                  return (totalItems + totalConsumibles + (Number(selected.labor_cost) || 0)).toFixed(2);
                                })()}
                          </Typography>
                          <Button variant="outlined" color="inherit" sx={{ mt: 2 }} onClick={() => { setEditMode(false); setSelected(null); }}>Cerrar</Button>
                        </>
                      )}
                    </Box>
                  </Dialog>
                )}
    </Box>
  );
}
