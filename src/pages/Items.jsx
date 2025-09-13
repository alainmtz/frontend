import React, { useState, useEffect, useRef } from 'react';
import { getItems, deleteItem, updateItem, createItem } from '../services/itemsService';
import { Box, Grid, Card, CardContent, CardActions, Button, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CardMedia, CardHeader, Badge, Chip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Select from 'react-select';
import ItemDetailsModal from '../components/ItemDetailsModal';
import ItemEditModal from '../components/ItemEditModal';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Puedes loguear el error aquí si lo deseas
    console.error("Error capturado en ErrorBoundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <Box sx={{ p: 8, color: 'error.main' }}>Ha ocurrido un error inesperado en la página de Items.</Box>;
    }
    return this.props.children;
  }
}

function Items() {
  const handleEditChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && files && files[0]) {
      setNewImage(files[0]);
      const reader = new FileReader();
      reader.onload = ev => setPreviewImg(ev.target.result);
      reader.readAsDataURL(files[0]);
      setEditData(prev => ({ ...prev, image_url: files[0].name }));
    } else {
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleDetails = (item) => {
    setSelected(item);
    setEditMode(false);
  };
  const handleEdit = (item) => {
    setSelected(item);
    setEditMode(true);
    setEditData(item);
    setPreviewImg(item.image_url ? `/uploads/${item.image_url}` : null);
  };
  const formatPrice = price => {
    if (typeof price !== 'number') return price;
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(price);
  };
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [sku, setSku] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredStatus, setFilteredStatus] = useState('');
  const [filteredSupplier, setFilteredSupplier] = useState('');
  const [mostSold, setMostSold] = useState('');
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [zoomImg, setZoomImg] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addData, setAddData] = useState({ name: '', sku: '', price: '', description: '', quantity: 0, image_url: '' });
  const [addImage, setAddImage] = useState(null);
  const [toast, setToast] = useState(null);
  const addFileInputRef = React.useRef();

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    let image_url = addData.image_url;
    if (addImage) {
      const formData = new FormData();
      formData.append('file', addImage);
      const res = await fetch('/api/items/upload', { method: 'POST', body: formData });
      const data = await res.json();
      image_url = data.image_url;
    }
    await createItem({ ...addData, image_url });
    setShowAddForm(false);
    setAddData({ name: '', sku: '', price: '', description: '', quantity: 0, image_url: '' });
    setAddImage(null);
    fetchItems();
  };

  const fetchItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
      setFiltered(data);
    } catch (err) {
      setToast('Error al obtener artículos: ' + err.message);
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
              placeholder="Nombre, SKU..."
              size="small"
              sx={{ minWidth: 180 }}
            />
            {/* Filtros solo visibles en escritorio */}
            <Box sx={{ minWidth: 180, display: { xs: 'none', sm: 'none' } }}>
              <Select
                options={[{ value: '', label: 'Todos los SKU' }, ...[...new Set(items.map(i => i.sku))].map(s => ({ value: s, label: s }))]}
                value={{ value: sku, label: sku || 'Todos los SKU' }}
                onChange={opt => setSku(opt.value)}
                placeholder="SKU"
                isClearable
              />
            </Box>
            <Box sx={{ minWidth: 180, display: { xs: 'none', sm: 'none' } }}>
              <Select
                options={[{ value: '', label: 'Precio mínimo' }, ...[...new Set(items.map(i => i.price))].sort((a,b)=>a-b).map(p => ({ value: p, label: formatPrice(p) }))]}
                value={{ value: minPrice, label: minPrice ? formatPrice(minPrice) : 'Precio mínimo' }}
                onChange={opt => setMinPrice(opt.value)}
                placeholder="Precio mínimo"
                isClearable
              />
            </Box>
            <Box sx={{ minWidth: 180, display: { xs: 'none', sm: 'none' } }}>
              <Select
                options={[{ value: '', label: 'Precio máximo' }, ...[...new Set(items.map(i => i.price))].sort((a,b)=>a-b).map(p => ({ value: p, label: formatPrice(p) }))]}
                value={{ value: maxPrice, label: maxPrice ? formatPrice(maxPrice) : 'Precio máximo' }}
                onChange={opt => setMaxPrice(opt.value)}
                placeholder="Precio máximo"
                isClearable
              />
            </Box>
            <Box sx={{ minWidth: 180, display: { xs: 'none', sm: 'none' } }}>
              <Select
                options={[
                  { value: '', label: 'Todos los estados' },
                  { value: 'disponible', label: 'Disponible' },
                  { value: 'bajo', label: 'Bajo stock' },
                  { value: 'agotado', label: 'Agotado' }
                ]}
                value={{ value: filteredStatus, label: filteredStatus || 'Todos los estados' }}
                onChange={opt => setFilteredStatus(opt.value)}
                placeholder="Estado"
                isClearable
              />
            </Box>
            <Box sx={{ minWidth: 180, display: { xs: 'none', sm: 'none' } }}>
              <Select
                options={[{ value: '', label: 'Todos los proveedores' }, ...[...new Set(items.map(i => i.supplier_name).filter(Boolean))].map(sup => ({ value: sup, label: sup }))]}
                value={{ value: filteredSupplier, label: filteredSupplier || 'Todos los proveedores' }}
                onChange={opt => setFilteredSupplier(opt.value)}
                placeholder="Proveedor"
                isClearable
              />
            </Box>
            <Box sx={{ minWidth: 180, display: { xs: 'none', sm: 'none' } }}>
              <Select
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'true', label: 'Más vendido' }
                ]}
                value={{ value: mostSold, label: mostSold || 'Todos' }}
                onChange={opt => setMostSold(opt.value)}
                placeholder="Más vendido"
                isClearable
              />
            </Box>
          </Box>
    }
  };

  const handleAddDragOver = e => {
    e.preventDefault();
  };

  // Manejo correcto de archivo para agregar ítem
  const handleAddFileChange = e => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAddImage(file);
      const reader = new FileReader();
      reader.onload = ev => setPreviewImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Manejo de drag & drop para agregar imagen
  const handleAddDrop = e => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      setAddImage(file);
      const reader = new FileReader();
      reader.onload = ev => setPreviewImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddChange = e => {
    setAddData({ ...addData, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setSelected(null);
    setEditMode(false);
    setNewImage(null);
    setPreviewImg(null);
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    setAddData({ name: '', sku: '', price: '', description: '', quantity: 0, image_url: '' });
    setAddImage(null);
    setPreviewImg(null);
  };

  const triggerAddFileInput = () => {
    if (addFileInputRef.current) {
      addFileInputRef.current.click();
    }
  };
  useEffect(() => {
    let result = [...items];
    if (search) {
      result = result.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.sku.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sku) {
      result = result.filter(i => i.sku === sku);
    }
    if (minPrice) {
      result = result.filter(i => Number(i.price) >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(i => Number(i.price) <= Number(maxPrice));
    }
    if (filteredStatus) {
      result = result.filter(i => {
        if (filteredStatus === 'disponible') return i.quantity > 4;
        if (filteredStatus === 'bajo') return i.quantity > 0 && i.quantity < 5;
        if (filteredStatus === 'agotado') return i.quantity === 0;
        return true;
      });
    }
    if (filteredSupplier) {
      result = result.filter(i => i.supplier_name === filteredSupplier);
    }
    if (mostSold === 'true') {
      result = result.filter(i => i.most_sold === true);
    }
    setFiltered(result);
  }, [items, search, sku, minPrice, maxPrice, filteredStatus, filteredSupplier, mostSold]);

  return (
    <ErrorBoundary>
    <Box sx={{ p: { xs: 2, md: 6 }, mt: { xs: 2, md: 6 }, mx: 'auto'  }}>
        {/* Toolbar and Filters */}
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
              placeholder="Nombre, SKU..."
              size="small"
              sx={{ minWidth: 180 }}
            />
            <Box sx={{ minWidth: 180 }}>
              <Select
                options={[{ value: '', label: 'Todos los SKU' }, ...[...new Set(items.map(i => i.sku))].map(s => ({ value: s, label: s }))]}
                value={{ value: sku, label: sku || 'Todos los SKU' }}
                onChange={opt => setSku(opt.value)}
                placeholder="SKU"
                isClearable
              />
            </Box>
            <Box sx={{ minWidth: 180 }}>
              <Select
                options={[{ value: '', label: 'Precio mínimo' }, ...[...new Set(items.map(i => i.price))].sort((a,b)=>a-b).map(p => ({ value: p, label: formatPrice(p) }))]}
                value={{ value: minPrice, label: minPrice ? formatPrice(minPrice) : 'Precio mínimo' }}
                onChange={opt => setMinPrice(opt.value)}
                placeholder="Precio mínimo"
                isClearable
              />
            </Box>
            <Box sx={{ minWidth: 180 }}>
              <Select
                options={[{ value: '', label: 'Precio máximo' }, ...[...new Set(items.map(i => i.price))].sort((a,b)=>a-b).map(p => ({ value: p, label: formatPrice(p) }))]}
                value={{ value: maxPrice, label: maxPrice ? formatPrice(maxPrice) : 'Precio máximo' }}
                onChange={opt => setMaxPrice(opt.value)}
                placeholder="Precio máximo"
                isClearable
              />
            </Box>
            <Box sx={{ minWidth: 180 }}>
              <Select
                options={[
                  { value: '', label: 'Todos los estados' },
                  { value: 'disponible', label: 'Disponible' },
                  { value: 'bajo', label: 'Bajo stock' },
                  { value: 'agotado', label: 'Agotado' }
                ]}
                value={{ value: filteredStatus, label: filteredStatus || 'Todos los estados' }}
                onChange={opt => setFilteredStatus(opt.value)}
                placeholder="Estado"
                isClearable
              />
            </Box>
            <Box sx={{ minWidth: 180 }}>
              <Select
                options={[{ value: '', label: 'Todos los proveedores' }, ...[...new Set(items.map(i => i.supplier_name).filter(Boolean))].map(sup => ({ value: sup, label: sup }))]}
                value={{ value: filteredSupplier, label: filteredSupplier || 'Todos los proveedores' }}
                onChange={opt => setFilteredSupplier(opt.value)}
                placeholder="Proveedor"
                isClearable
              />
            </Box>
            <Box sx={{ minWidth: 180 }}>
              <Select
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'true', label: 'Más vendido' }
                ]}
                value={{ value: mostSold, label: mostSold || 'Todos' }}
                onChange={opt => setMostSold(opt.value)}
                placeholder="Más vendido"
                isClearable
              />
            </Box>
          </Box>
        </Box>
        {/* Grid of Items */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
            {filtered.map(item => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ width: 330, height: 110, minWidth: 240, minHeight: 90, boxShadow: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', px: 2, py: 1 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2, boxShadow: 1, mr: 2, cursor: item.image_url ? 'pointer' : 'default' }}
                    image={item.image_url ? `/uploads/${item.image_url}` : 'https://mui.com/static/images/cards/contemplative-reptile.jpg'}
                    alt={item.name}
                    onClick={() => item.image_url && setZoomImg(`/uploads/${item.image_url}`)}
                  />
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.5 }}>
                    <Typography variant="subtitle2" color="primary.main" fontWeight={700} >{item.name}</Typography>
                    <Typography variant="body2" color="info.main" fontWeight={700} noWrap>{formatPrice(item.price)}</Typography>
                    <Typography variant="body2" color="secondary.main" fontWeight={500} noWrap>{item.supplier_name || 'Sin proveedor'}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>Stock: <b>{item.quantity}</b></Typography>
                  </Box>
                  <CardActions sx={{ flexDirection: 'column', gap: 0.5, p: 0 , spacing: 2 }}>
                    <IconButton color="primary" size="small" onClick={() => handleDetails(item)} aria-label="Detalles">
                      <InfoIcon />
                    </IconButton>
                    <IconButton color="info" size="small" onClick={() => handleEdit(item)} aria-label="Editar">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={async () => {
                      if (window.confirm('¿Eliminar artículo?')) {
                        try {
                          const transRes = await fetch(`/api/transactions?item_id=${item.id}`);
                          const transData = await transRes.json();
                          if (Array.isArray(transData) && transData.length > 0) {
                            setToast('No se puede eliminar el artículo porque tiene transacciones asociadas.');
                            return;
                          }
                          await deleteItem(item.id);
                          fetchItems();
                        } catch (err) {
                          setToast('Error al verificar transacciones.');
                        }
                      }
                    }} aria-label="Eliminar">
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Box>
            ))}
  </Box>
        {/* Detalles Modal */}
        <ItemDetailsModal item={selected} open={!!selected && !editMode} onClose={closeModal} />
        {/* Edit Modal */}
        {(!!selected && editMode) && (
          <ItemEditModal
            item={editData}
            open={true}
            onClose={closeModal}
            onChange={handleEditChange}
            onSubmit={handleEditSubmit}
            loading={loading}
            previewImg={previewImg}
            onFileChange={handleFileChange}
            onDragOver={handleDragOver}
            triggerFileInput={triggerAddFileInput}
            addFileInputRef={addFileInputRef}
          />
        )}
        {/* Zoom Image Modal */}
        {zoomImg && (
          <Dialog open={!!zoomImg} onClose={() => setZoomImg(null)} maxWidth="md">
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.6)' }}>
              <img src={zoomImg} alt="Zoom" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8, boxShadow: 8 }} />
            </DialogContent>
          </Dialog>
        )}
        {/* Add Item Button and Form */}
        <Box sx={{ position: 'fixed', bottom: 32, right: 32 }}>
          <Button variant="contained" color="success" onClick={() => setShowAddForm(true)}><AddIcon />Agregar Artículo</Button>
        </Box>
        {showAddForm && (
          <Dialog open={showAddForm} onClose={closeAddForm} maxWidth="md">
            <form onSubmit={handleAddItem}>
              <DialogTitle>Agregar Nuevo Artículo</DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                  <Box sx={{ width: { xs: '100%', md: '33%' } }}>
                    <Box
                      sx={{ width: '100%', height: 192, border: '1px dashed', borderColor: 'grey.400', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      onDrop={handleAddDrop}
                      onDragOver={handleAddDragOver}
                      onClick={triggerAddFileInput}
                    >
                      {previewImg ? (
                        <img src={previewImg} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Typography color="text.secondary">Arrastra y suelta o haz clic para subir imagen</Typography>
                      )}
                      <input type="file" accept="image/*" style={{ display: 'none' }} ref={addFileInputRef} onChange={handleAddFileChange} />
                    </Box>
                  </Box>
                  <Box sx={{ width: { xs: '100%', md: '67%' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Nombre" name="name" value={addData.name} onChange={handleAddChange} required size="small" />
                    <TextField label="SKU" name="sku" value={addData.sku} onChange={handleAddChange} required size="small" />
                    <TextField label="Precio" name="price" type="number" inputProps={{ min: 0, step: 0.01 }} value={addData.price} onChange={handleAddChange} required size="small" />
                    <TextField label="Cantidad" name="quantity" type="number" inputProps={{ min: 0 }} value={addData.quantity} onChange={handleAddChange} required size="small" />
                    <TextField label="Descripción" name="description" value={addData.description} onChange={handleAddChange} multiline rows={2} size="small" />
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="success" type="submit">Agregar Artículo</Button>
                <Button variant="outlined" color="inherit" onClick={closeAddForm}>Cancelar</Button>
              </DialogActions>
            </form>
          </Dialog>
        )}
        {toast && (
          <Box sx={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', bgcolor: 'grey.900', color: 'common.white', px: 4, py: 2, borderRadius: 2, boxShadow: 2 }}>
            {toast}
          </Box>
        )}
      
      </Box>
    </ErrorBoundary>
  );
}

export default Items;
