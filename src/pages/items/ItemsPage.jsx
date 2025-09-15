
import React, { useContext } from 'react';
import { Container, Box, Typography, Grid, CircularProgress, Snackbar, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useItems from '../../hooks/useItems';
import Pagination from '@mui/material/Pagination';
import ItemCard from '../../components/ItemCard';
import ItemDetails from '../../components/ItemDetails';
import ItemEdit from '../../components/ItemEdit';
import { AuthContext } from '../../context/AuthContext';

export default function ItemsPage() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { items, loading, error, fetchItems, deleteItem, editItem, page, limit, total, goToPage } = useItems(user?.token);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, itemId: null });
  const [editDialog, setEditDialog] = React.useState({ open: false, item: null });
  const [detailsDialog, setDetailsDialog] = React.useState({ open: false, item: null });

  const handleEdit = (item) => {
    setEditDialog({ open: true, item });
  };

  const handleShowDetails = (item) => {
    setDetailsDialog({ open: true, item });
  };

  const handleDelete = (id) => {
    setDeleteDialog({ open: true, itemId: id });
  };

  const confirmDelete = async () => {
    const { itemId } = deleteDialog;
    if (!itemId) return;
    const result = await deleteItem(itemId);
    if (result.success) {
      setSnackbar({ open: true, message: t('items.deleteSuccess', 'Item eliminado correctamente'), severity: 'success' });
    } else {
      setSnackbar({ open: true, message: t('items.deleteError', 'Error al eliminar item'), severity: 'error' });
    }
    setDeleteDialog({ open: false, itemId: null });
  };

  // Simple edición: solo nombre y descripción
  const [editForm, setEditForm] = React.useState({ name: '', description: '' });
  React.useEffect(() => {
    if (editDialog.open && editDialog.item) {
      setEditForm({ name: editDialog.item.name, description: editDialog.item.description });
    }
  }, [editDialog]);

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const confirmEdit = async () => {
    const { item } = editDialog;
    if (!item) return;
    const result = await editItem(item.id, editForm);
    if (result.success) {
      setSnackbar({ open: true, message: t('items.editSuccess', 'Item editado correctamente'), severity: 'success' });
    } else {
      setSnackbar({ open: true, message: t('items.editError', 'Error al editar item'), severity: 'error' });
    }
    setEditDialog({ open: false, item: null });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>{t('items.title', 'Gestión de Items')}</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>{t('items.add', 'Agregar Item')}</Button>
      </Box>
      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{t('items.error', 'Error al cargar items')}</Alert>
      ) : (
        <>
          <Grid container columns={12} spacing={2}>
            {items.map(item => (
              <Grid gridColumn="span 3" key={item.id}>
                <ItemCard item={item} onEdit={handleEdit} onDelete={handleDelete} onShowDetails={handleShowDetails} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={Math.ceil(total / limit)}
              page={page}
              onChange={(_, value) => goToPage(value)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, itemId: null })}>
        <DialogTitle>{t('items.confirmDeleteTitle', '¿Eliminar item?')}</DialogTitle>
        <DialogContent>
          <Typography>{t('items.confirmDeleteText', '¿Estás seguro de que deseas eliminar este item?')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, itemId: null })}>{t('common.cancel', 'Cancelar')}</Button>
          <Button color="error" onClick={confirmDelete}>{t('common.delete', 'Eliminar')}</Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo de detalles del item */}
      <ItemDetails open={detailsDialog.open} onClose={() => setDetailsDialog({ open: false, item: null })} item={detailsDialog.item} />

      {/* Dialogo de edición avanzada */}
      <ItemEdit
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, item: null })}
        item={editDialog.item}
        onSave={async (form) => {
          const { item } = editDialog;
          if (!item) return;
          const result = await editItem(item.id, form);
          if (result.success) {
            setSnackbar({ open: true, message: t('items.editSuccess', 'Item editado correctamente'), severity: 'success' });
          } else {
            setSnackbar({ open: true, message: t('items.editError', 'Error al editar item'), severity: 'error' });
          }
          setEditDialog({ open: false, item: null });
        }}
      />
    </Container>
  );
}
