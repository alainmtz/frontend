import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import FinancesCards from '../../components/FinancesCards';
import { useTranslation } from 'react-i18next';
import useFinances from '../../hooks/useFinances';


const Finances = () => {
  const { t } = useTranslation();
  // Obtener token real desde localStorage
  const token = localStorage.getItem('token') || '';
  const { finances, loading } = useFinances(token);
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 10, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" align="center" gutterBottom>{t('finances.title', 'Control de Finanzas')}</Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>{t('finances.add', 'Agregar Movimiento')}</Button>
        <FinancesCards
          finances={finances}
          onEdit={f => {}}
          onDelete={id => {}}
          loading={loading}
        />
      </Box>
    </Container>
  );
};

export default Finances;
