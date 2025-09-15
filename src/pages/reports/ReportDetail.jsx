import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

export default function ReportDetail({ open, onClose, report, isAdmin }) {
  const { t } = useTranslation();
  if (!report) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('reports.detailTitle', 'Detalle del Reporte')}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="primary">{t('reports.type', 'Tipo')}: {report.type}</Typography>
          <Typography>{t('reports.date', 'Fecha')}: {report.date}</Typography>
          {report.user && <Typography>{t('reports.user', 'Usuario')}: {report.user}</Typography>}
          {report.description && <Typography>{t('reports.description', 'Descripción')}: {report.description}</Typography>}
          {/* Agrega aquí más campos según la estructura del reporte */}
        </Box>
        {isAdmin && (
          <Typography color="secondary">{t('reports.editable', 'Este reporte puede ser editado por administradores.')}</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
