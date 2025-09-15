
import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ReportsCards({ reports, onCardClick, loading }) {
  const { t } = useTranslation();
  if (loading) return <Typography>{t('reports.loading', 'Cargando...')}</Typography>;
  if (!reports.length) return <Typography>{t('reports.empty', 'Sin reportes')}</Typography>;
  return (
    <Grid container spacing={2}>
      {reports.map(report => (
        <Grid item xs={12} sm={6} md={4} key={report.id}>
          <Card variant="outlined" sx={{ mb: 2, cursor: 'pointer' }} onClick={() => onCardClick(report)}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>{t('reports.type', 'Tipo')}: {report.type}</Typography>
              <Typography>{t('reports.date', 'Fecha')}: {report.date}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
