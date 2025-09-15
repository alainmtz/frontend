import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import ReportsCards from '../../components/ReportsCards';
import ReportDetail from './ReportDetail';
import { useTranslation } from 'react-i18next';
import useReports from '../../hooks/useReports';


const Reports = () => {
  const { t } = useTranslation();

  // Simulación de usuario actual y rol (reemplazar por datos reales de sesión)
  const currentUser = { username: 'usuario1', isAdmin: false };
  const { reports, loading } = useReports();
  const [typeFilter, setTypeFilter] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  // Filtrar reportes por tipo, rango de fechas y usuario
  const filteredReports = reports.filter(r => {
    const date = new Date(r.date);
    const start = dateStart ? new Date(dateStart) : null;
    const end = dateEnd ? new Date(dateEnd) : null;
    return (!typeFilter || r.type?.toLowerCase().includes(typeFilter.toLowerCase())) &&
      (!start || date >= start) &&
      (!end || date <= end) &&
      (currentUser.isAdmin || r.user === currentUser.username);
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 10, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" align="center" gutterBottom>{t('reports.title', 'Reportes')}</Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>{t('reports.generate', 'Generar Reporte')}</Button>
        <TextField
          label={t('reports.filterType', 'Filtrar por tipo')}
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label={t('reports.filterDateStart', 'Fecha inicio')}
            type="date"
            value={dateStart}
            onChange={e => setDateStart(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t('reports.filterDateEnd', 'Fecha fin')}
            type="date"
            value={dateEnd}
            onChange={e => setDateEnd(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <ReportsCards
          reports={filteredReports}
          onCardClick={setSelectedReport}
          loading={loading}
        />
        <ReportDetail
          open={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          report={selectedReport}
          isAdmin={currentUser.isAdmin}
        />
      </Box>
    </Container>
  );
};

export default Reports;
