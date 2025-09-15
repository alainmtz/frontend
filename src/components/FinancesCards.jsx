import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

export default function FinancesCards({ finances, onEdit, onDelete, loading }) {
  const { t } = useTranslation();
  if (loading) return <Typography>{t('finances.loading', 'Cargando...')}</Typography>;
  if (!finances.length) return <Typography>{t('finances.empty', 'Sin movimientos')}</Typography>;
  return (
    <Grid container spacing={2}>
      {finances.map(finance => (
        <Grid item xs={12} sm={6} md={4} key={finance.id}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>{t('finances.concept', 'Concepto')}: {finance.concept}</Typography>
              <Typography>{t('finances.amount', 'Monto')}: {finance.amount}</Typography>
              <Typography>{t('finances.date', 'Fecha')}: {finance.date}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <IconButton color="primary" onClick={() => onEdit(finance)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => onDelete(finance.id)}><DeleteIcon /></IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
