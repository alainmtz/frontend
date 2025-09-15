
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Modal, IconButton, Tooltip, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

export default function ItemCard({ item, onEdit, onDelete, onShowDetails }) {
  const { t } = useTranslation();
  const [imgModal, setImgModal] = React.useState(false);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'row', height: 180, minHeight: 180, maxHeight: 180, width: 500, minWidth: 500, maxWidth: 500, m: 2, cursor: 'pointer', boxSizing: 'border-box' }}>
      {/* Imagen a la izquierda, click abre modal */}
      <Box sx={{ width: 180, minWidth: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }} onClick={e => { e.stopPropagation(); setImgModal(true); }}>
        {item.image_url ? (
          <CardMedia
            component="img"
            image={`/uploads/${item.image_url}`}
            alt={item.name}
            sx={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 2 }}
          />
        ) : (
          <Box sx={{ width: 120, height: 120, bgcolor: 'grey.200', borderRadius: 2 }} />
        )}
      </Box>
      {/* Modal full-width para imagen */}
      <Modal open={imgModal} onClose={() => setImgModal(false)}>
        <Box sx={{ width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setImgModal(false)}>
          <img src={`/uploads/${item.image_url}`} alt={item.name} style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8 }} />
        </Box>
      </Modal>
      {/* Cuerpo de la tarjeta, click abre detalles */}
      <Box sx={{ flex: 1, p: 2 }} onClick={() => onShowDetails(item)}>
        <CardContent sx={{ p: 0 }}>
          <Typography gutterBottom variant="h6" color="primary">{item.name}</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            <Chip label={t('items.price', 'Precio') + ': $' + item.price} color="primary" size="small" />
            <Chip label={t('items.quantity', 'Cantidad') + ': ' + item.quantity} color="secondary" size="small" />
          </Box>
        </CardContent>
      </Box>
      {/* Acciones a la derecha */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1, pr: 2 }}>
        <Tooltip title={t('items.edit', 'Editar')}>
          <IconButton color="primary" size="small" onClick={e => { e.stopPropagation(); onEdit(item); }}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('items.delete', 'Eliminar')}>
          <IconButton color="error" size="small" onClick={e => { e.stopPropagation(); onDelete(item.id); }}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
}
