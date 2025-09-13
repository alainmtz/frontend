import React, { useEffect, useState } from 'react';
import { getSuppliers, deleteSupplier, updateSupplier } from '../services/suppliersService';
import { FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const data = await getSuppliers();
    setSuppliers(data);
    setFiltered(data);
  };

  useEffect(() => {
    let result = suppliers;
    if (search) {
      result = result.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (contact) {
      result = result.filter(s => (s.contact_person || '').toLowerCase().includes(contact.toLowerCase()));
    }
    if (email) {
      result = result.filter(s => (s.email || '').toLowerCase().includes(email.toLowerCase()));
    }
    setFiltered(result);
  }, [search, contact, email, suppliers]);

  // Acciones
  const handleEdit = (supplier) => {
    setSelected(supplier);
    setEditMode(true);
    setEditData({
      name: supplier.name,
      contact_person: supplier.contact_person,
      email: supplier.email,
      phone: supplier.phone
    });
  };
  const handleDelete = async (supplier) => {
    if (window.confirm(`¿Seguro que deseas eliminar el proveedor ${supplier.name}?`)) {
      setLoading(true);
      try {
        await deleteSupplier(supplier.id);
        await fetchSuppliers();
        setSelected(null);
      } catch (err) {
        alert('Error al eliminar proveedor');
      }
      setLoading(false);
    }
  };
  const handleDetails = (supplier) => {
    setSelected(supplier);
    setEditMode(false);
  };
  const handleEditChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSupplier(selected.id, editData);
      await fetchSuppliers();
      setEditMode(false);
      setSelected(null);
    } catch (err) {
      alert('Error al editar proveedor');
    }
    setLoading(false);
  };

  return (
  <Box sx={{ p: { xs: 2, md: 6 }, mt: { xs: 2, md: 6 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={4}>Proveedores</Typography>
      <Box mb={6} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField type="text" label="Buscar por nombre" value={search} onChange={e => setSearch(e.target.value)} size="small" />
        <TextField type="text" label="Buscar por contacto" value={contact} onChange={e => setContact(e.target.value)} size="small" />
        <TextField type="text" label="Buscar por email" value={email} onChange={e => setEmail(e.target.value)} size="small" />
      </Box>
      <Grid container spacing={2}>
        {filtered.map(supplier => (
          <Grid item xs={12} sm={6} md={3} key={supplier.id}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Box sx={{ width: 64, height: 64, bgcolor: 'grey.200', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, overflow: 'hidden' }}>
                {supplier.image_url ? (
                  <img src={`/uploads/${supplier.image_url}`} alt={supplier.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Typography color="text.secondary" fontWeight={700} fontSize={32}>{supplier.name[0]}</Typography>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700} fontSize={18}>{supplier.name}</Typography>
                <Typography color="text.secondary" fontSize={14}>ID: {supplier.id}</Typography>
                <Typography color="text.secondary" fontSize={14}>Contacto: {supplier.contact_person || 'N/A'}</Typography>
                <Typography color="text.secondary" fontSize={14}>Email: {supplier.email || 'N/A'}</Typography>
                <Typography color="text.secondary" fontSize={14}>Teléfono: {supplier.phone || 'N/A'}</Typography>
              </Box>
              <CardActions sx={{ flexDirection: 'column', gap: 1, ml: 2 }}>
                <Button variant="outlined" color="info" size="small" onClick={() => handleDetails(supplier)} title="Detalles"><FaInfoCircle size={20} /></Button>
                <Button variant="outlined" color="primary" size="small" onClick={() => handleEdit(supplier)} title="Editar"><FaEdit size={20} /></Button>
                <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(supplier)} disabled={loading} title="Eliminar"><FaTrash size={20} /></Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Modal de detalles/edición */}
      {selected && (
        <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm">
          <Box sx={{ p: 4 }}>
            {editMode ? (
              <Box component="form" onSubmit={handleEditSubmit}>
                <Typography variant="h6" fontWeight={700} mb={2}>Editar Proveedor</Typography>
                <TextField name="name" label="Nombre" value={editData.name} onChange={handleEditChange} required fullWidth size="small" sx={{ mb: 2 }} />
                <TextField name="contact_person" label="Contacto" value={editData.contact_person || ''} onChange={handleEditChange} fullWidth size="small" sx={{ mb: 2 }} />
                <TextField name="email" label="Email" type="email" value={editData.email || ''} onChange={handleEditChange} fullWidth size="small" sx={{ mb: 2 }} />
                <TextField name="phone" label="Teléfono" value={editData.phone || ''} onChange={handleEditChange} fullWidth size="small" sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button type="submit" variant="contained" color="primary" disabled={loading}>Guardar</Button>
                  <Button type="button" variant="outlined" color="inherit" onClick={() => setEditMode(false)}>Cancelar</Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="h6" fontWeight={700} mb={2}>Detalles del Proveedor</Typography>
                <Typography mb={1}><b>ID:</b> {selected.id}</Typography>
                <Typography mb={1}><b>Nombre:</b> {selected.name}</Typography>
                <Typography mb={1}><b>Contacto:</b> {selected.contact_person || 'N/A'}</Typography>
                <Typography mb={1}><b>Email:</b> {selected.email || 'N/A'}</Typography>
                <Typography mb={1}><b>Teléfono:</b> {selected.phone || 'N/A'}</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>Editar</Button>
                  <Button variant="contained" color="error" onClick={() => handleDelete(selected)} disabled={loading}>Eliminar</Button>
                  <Button variant="outlined" color="inherit" onClick={() => setSelected(null)}>Cerrar</Button>
                </Box>
              </>
            )}
          </Box>
        </Dialog>
      )}
    </Box>
  );
}
