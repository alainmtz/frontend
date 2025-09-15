import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

export default function TransactionsCards({ transactions, onEdit, onDelete, loading }) {
  const { t } = useTranslation();
  if (loading) return <Typography>{t('transactions.loading', 'Cargando...')}</Typography>;
  if (!transactions.length) return <Typography>{t('transactions.empty', 'Sin transacciones')}</Typography>;
  return (
    <Grid container spacing={2}>
      {transactions.map(tx => (
        <Grid item xs={12} sm={6} md={4} key={tx.id}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>{t('transactions.type', 'Tipo')}: {tx.type}</Typography>
              <Typography>{t('transactions.amount', 'Monto')}: {tx.amount}</Typography>
              <Typography>{t('transactions.date', 'Fecha')}: {tx.date}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <IconButton color="primary" onClick={() => onEdit(tx)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => onDelete(tx.id)}><DeleteIcon /></IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
