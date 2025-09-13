import React, { useEffect, useState } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/productsService';
import { Box, Grid, Card, CardActions, Button, Typography, Chip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaInfoCircle } from 'react-icons/fa';
import Select from 'react-select';
import ViewProductDetails from '../components/ViewProductDetails';
import EditProduct from '../components/EditProduct';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [detailsMode, setDetailsMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getProducts()
      .then(data => {
        setProducts(data);
        setFiltered(data);
      })
      .catch(err => {
        setToast('Error al obtener productos: ' + err.message);
        setProducts([]);
        setFiltered([]);
      });
  }, []);

  useEffect(() => {
    let result = [...products];
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (category) {
      result = result.filter(p => p.category === category);
    }
    if (minPrice) {
      result = result.filter(p => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => Number(p.price) <= Number(maxPrice));
    }
    setFiltered(result);
  }, [products, search, category, minPrice, maxPrice]);

  const formatPrice = price => {
    if (typeof price !== 'number') return price;
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
  };

  const handleEdit = product => {
    setEditData(product);
    setEditMode(true);
    setDetailsMode(false);
    setSelected(product);
  };

  const handleDetails = product => {
    setEditData(product);
    setDetailsMode(true);
    setEditMode(false);
    setSelected(product);
  };

  const handleEditChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProduct(selected.id, editData);
      const data = await getProducts();
      setProducts(data);
      setFiltered(data);
      setEditMode(false);
      setSelected(null);
    } catch (err) {
      setToast('Error al editar producto');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    if (window.confirm('¿Eliminar producto?')) {
      await deleteProduct(id);
      const data = await getProducts();
      setProducts(data);
      setFiltered(data);
    }
  };

  const closeModal = () => {
    setSelected(null);
    setEditMode(false);
    setDetailsMode(false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, mt: { xs: 2, md: 6 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={4}>Productos</Typography>
      {/* Toolbar de filtros */}
      <Box sx={{ backgroundColor: 'background.paper', mb: 6, px: { xs: 1, md: 0 }, py: 2, borderRadius: 2, boxShadow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 2 },
            width: '100%',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            overflowX: { xs: 'visible', sm: 'auto', md: 'visible' },
            alignItems: { xs: 'stretch', sm: 'center' },
            pb: 1,
            '& > *': { minWidth: { xs: '100%', sm: 180 } }
          }}
        >
          <TextField
            label="Buscar"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nombre..."
            size="small"
            sx={{ minWidth: 180 }}
          />
          {/* Filtros solo visibles en escritorio */}
          <Box sx={{ minWidth: 180, display: { xs: 'none', sm: 'block' } }}>
            <Select
              options={[{ value: '', label: 'Categoría' }, ...[...new Set(products.map(p => p.category).filter(Boolean))].map(c => ({ value: c, label: c }))]}
              value={{ value: category, label: category || 'Categoría' }}
              onChange={opt => setCategory(opt.value)}
              placeholder="Categoría"
              isClearable
            />
          </Box>
          <Box sx={{ minWidth: 180, display: { xs: 'none', sm: 'block' } }}>
            <Select
              options={[{ value: '', label: 'Precio mínimo' }, ...[...new Set(products.map(p => p.price))].sort((a,b)=>a-b).map(p => ({ value: p, label: formatPrice(p) }))]}
              value={{ value: minPrice, label: minPrice ? formatPrice(minPrice) : 'Precio mínimo' }}
              onChange={opt => setMinPrice(opt.value)}
              placeholder="Precio mínimo"
              isClearable
            />
          </Box>
          <Box sx={{ minWidth: 180, display: { xs: 'none', sm: 'block' } }}>
            <Select
              options={[{ value: '', label: 'Precio máximo' }, ...[...new Set(products.map(p => p.price))].sort((a,b)=>a-b).map(p => ({ value: p, label: formatPrice(p) }))]}
              value={{ value: maxPrice, label: maxPrice ? formatPrice(maxPrice) : 'Precio máximo' }}
              onChange={opt => setMaxPrice(opt.value)}
              placeholder="Precio máximo"
              isClearable
            />
          </Box>
        </Box>
      </Box>
      {/* Grid de productos */}
      <Grid container spacing={2} columns={12} mb={4}>
        {filtered.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: 370, minHeight: 140, boxShadow: 3, display: 'flex', flexDirection: 'row', alignItems: 'center', p: 1 }}>
              <Box sx={{ flex: '0 0 100px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                {product.image_url ? (
                  <img src={`/uploads/${product.image_url}`} alt={product.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8, border: '2px solid #eee' }} />
                ) : (
                  <Box sx={{ width: 90, height: 90, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.500', borderRadius: 2 }}>Sin imagen</Box>
                )}
              </Box>
              <Box sx={{ flex: 1, px: 2, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  color="primary.main"
                  fontWeight={700}
                  noWrap
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => handleDetails(product)}
                >
                  {product.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip label={product.brand || 'Sin marca'} size="small" color="info" />
                  <Chip label={product.model || 'Sin modelo'} size="small" color="info" />
                </Box>
                <Chip label={`Cantidad: ${product.quantity}`} size="small" color="info" sx={{ mr: 1, mt: 1 }} />
                <Chip label={getStatus(product.quantity)} size="small" color={getStatusColor(product.quantity)} sx={{ mt: 1 }} />
              </Box>
              <CardActions sx={{ flexDirection: 'column', gap: 1, alignItems: 'center', pr: 1 }}>
                <IconButton color="primary" onClick={() => handleEdit(product)}><EditIcon /></IconButton>
                <IconButton color="info" onClick={() => handleDetails(product)}><FaInfoCircle /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(product.id)}><DeleteIcon /></IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <EditProduct
        open={!!selected && editMode && editData && typeof editData === 'object' && Object.keys(editData).length > 0}
        onClose={closeModal}
        product={editData}
        onChange={handleEditChange}
        onSubmit={handleEditSubmit}
        loading={loading}
      />
      <ViewProductDetails
        open={!!selected && detailsMode && editData && typeof editData === 'object' && Object.keys(editData).length > 0}
        onClose={closeModal}
        product={editData}
      />
      {/* Toasts */}
      {toast && (
        <Box sx={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', bgcolor: 'grey.900', color: 'common.white', px: 4, py: 2, borderRadius: 2, boxShadow: 2 }}>
          {toast}
        </Box>
      )}


    </Box>
  );
}

// Helpers para status visual (deben estar fuera del componente)
export function getStatus(quantity) {
  if (typeof quantity === 'undefined' || quantity === null) return 'Sin stock';
  if (quantity === 0) return 'Agotado';
  if (quantity < 5) return 'Bajo stock';
  return 'Disponible';
}
export function getStatusColor(quantity) {
  if (typeof quantity === 'undefined' || quantity === null) return 'default';
  if (quantity === 0) return 'error';
  if (quantity < 5) return 'warning';

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, mt: { xs: 2, md: 6 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={4}>Productos</Typography>
      {/* Toolbar de filtros */}
      <Box sx={{ backgroundColor: 'background.paper', mb: 6, px: { xs: 1, md: 0 }, py: 2, borderRadius: 2, boxShadow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 2 },
            width: '100%',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            overflowX: { xs: 'visible', sm: 'auto', md: 'visible' },
            alignItems: { xs: 'stretch', sm: 'center' },
            pb: 1,
            '& > *': { minWidth: { xs: '100%', sm: 180 } }
          }}
        >
          <TextField
            label="Buscar"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nombre..."
            size="small"
            sx={{ minWidth: 180 }}
          />
          {/* Filtros solo visibles en escritorio */}
          <Box sx={{ minWidth: 180, display: { xs: 'none', sm: 'block' } }}>
            <Select
              options={[{ value: '', label: 'Categoría' }, ...[...new Set(products.map(p => p.category).filter(Boolean))].map(c => ({ value: c, label: c }))]}
              value={{ value: category, label: category || 'Categoría' }}
              onChange={opt => setCategory(opt.value)}
              placeholder="Categoría"
              isClearable
            />
          </Box>
          <Box sx={{ minWidth: 180, display: { xs: 'none', sm: 'block' } }}>
            <Select
              options={[{ value: '', label: 'Precio mínimo' }, ...[...new Set(products.map(p => p.price))].sort((a,b)=>a-b).map(p => ({ value: p, label: formatPrice(p) }))]}
              value={{ value: minPrice, label: minPrice ? formatPrice(minPrice) : 'Precio mínimo' }}
              onChange={opt => setMinPrice(opt.value)}
              placeholder="Precio mínimo"
              isClearable
            />
          </Box>
          <Box sx={{ minWidth: 180, display: { xs: 'none', sm: 'block' } }}>
            <Select
              options={[{ value: '', label: 'Precio máximo' }, ...[...new Set(products.map(p => p.price))].sort((a,b)=>a-b).map(p => ({ value: p, label: formatPrice(p) }))]}
              value={{ value: maxPrice, label: maxPrice ? formatPrice(maxPrice) : 'Precio máximo' }}
              onChange={opt => setMaxPrice(opt.value)}
              placeholder="Precio máximo"
              isClearable
            />
          </Box>
        </Box>
      </Box>
      {/* Grid de productos */}
      <Grid container spacing={2} columns={12} mb={4}>
        {filtered.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: 370, minHeight: 140, boxShadow: 3, display: 'flex', flexDirection: 'row', alignItems: 'center', p: 1 }}>
              <Box sx={{ flex: '0 0 100px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                {product.image_url ? (
                  <img src={`/uploads/${product.image_url}`} alt={product.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8, border: '2px solid #eee' }} />
                ) : (
                  <Box sx={{ width: 90, height: 90, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.500', borderRadius: 2 }}>Sin imagen</Box>
                )}
              </Box>
              <Box sx={{ flex: 1, px: 2, minWidth: 0 }}>
                <Typography variant="h6" color="primary.main" fontWeight={700} noWrap>{product.name}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip label={product.brand || 'Sin marca'} size="small" color="info" />
                  <Chip label={product.model || 'Sin modelo'} size="small" color="info" />
                </Box>
                <Chip label={`Cantidad: ${product.quantity}`} size="small" color="info" sx={{ mr: 1, mt: 1 }} />
                <Chip label={getStatus(product.quantity)} size="small" color={getStatusColor(product.quantity)} sx={{ mt: 1 }} />
              </Box>
              <CardActions sx={{ flexDirection: 'column', gap: 1, alignItems: 'center', pr: 1 }}>
                <IconButton color="primary" onClick={() => handleEdit(product)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(product.id)}><DeleteIcon /></IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Edit Modal */}
      {(!!selected && editMode && editData && typeof editData === 'object' && Object.keys(editData).length > 0) && (
        <Dialog open={true} onClose={closeModal} maxWidth="sm">
          <form onSubmit={handleEditSubmit}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
              <Typography variant="h6" fontWeight={700}>Editar Producto</Typography>
              <IconButton onClick={closeModal} size="large"><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Chip label={editData.name || ''} color="primary" sx={{ mb: 1 }} />
                <Chip label={editData.category || 'Sin categoría'} color="info" sx={{ mb: 1 }} />
                <Chip label={`Stock: ${editData.stock || 0}`} color="info" sx={{ mb: 1 }} />
                <Chip label={`PRECIO: ${formatPrice(editData.price)}`} color="error" sx={{ mb: 1 }} />
                <TextField label="Nombre" name="name" value={editData.name || ''} onChange={handleEditChange} required size="small" />
                <TextField label="Categoría" name="category" value={editData.category || ''} onChange={handleEditChange} size="small" />
                <TextField label="Precio" name="price" type="number" inputProps={{ min: 0, step: 0.01 }} value={editData.price || ''} onChange={handleEditChange} required size="small" />
                <TextField label="Stock" name="stock" type="number" inputProps={{ min: 0 }} value={editData.stock || ''} onChange={handleEditChange} required size="small" />
                <TextField label="Descripción" name="description" value={editData.description || ''} onChange={handleEditChange} multiline rows={2} size="small" />
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button variant="contained" color="primary" type="submit" startIcon={<SaveIcon />}>Guardar</Button>
              <Button variant="outlined" color="inherit" onClick={closeModal}>Cancelar</Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
      {/* Toasts */}
      {toast && (
        <Box sx={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', bgcolor: 'grey.900', color: 'common.white', px: 4, py: 2, borderRadius: 2, boxShadow: 2 }}>
          {toast}
        </Box>
      )}
    </Box>
  );
}
