import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { Container, Box, Typography, Grid, Paper, Select, MenuItem, IconButton, CircularProgress } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { ThemeContext } from '../../context/ThemeContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    finances: { count: 0, total: 0 },
    projects: { count: 0 },
    transactions: { count: 0 },
    reports: { count: 0 },
    stats: { usersByRole: {} }
  });
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { toggleMode, mode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setStats(res.data);
      } catch (err) {
        // Manejar error
      }
      setLoading(false);
    };
    fetchStats();
  }, [user]);

  const handleLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" fontWeight={700}>{t('dashboard.title', 'Dashboard')}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Select value={i18n.language} onChange={handleLangChange} size="small">
            <MenuItem value="es">Español</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
          <IconButton color="primary" title={t('dashboard.theme', 'Cambiar tema')} onClick={toggleMode}>
            <Brightness4Icon />
          </IconButton>
        </Box>
      </Box>
      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}><CircularProgress /></Box>
      ) : (
        <Grid container columns={12} spacing={4}>
          <Grid gridColumn="span 3">
            <Paper sx={{ p: 3, textAlign: 'center' }} elevation={3}>
              <Typography variant="h6" gutterBottom>{t('dashboard.finances', 'Finanzas')}</Typography>
              <Typography variant="body1">{t('dashboard.total', 'Total')}: <b>${stats.finances?.total ?? 0}</b></Typography>
              <Typography variant="body1">{t('dashboard.count', 'Movimientos')}: <b>{stats.finances?.count ?? 0}</b></Typography>
            </Paper>
          </Grid>
          <Grid gridColumn="span 3">
            <Paper sx={{ p: 3, textAlign: 'center' }} elevation={3}>
              <Typography variant="h6" gutterBottom>{t('dashboard.projects', 'Proyectos')}</Typography>
              <Typography variant="body1">{t('dashboard.count', 'Cantidad')}: <b>{stats.projects?.count ?? 0}</b></Typography>
            </Paper>
          </Grid>
          <Grid gridColumn="span 3">
            <Paper sx={{ p: 3, textAlign: 'center' }} elevation={3}>
              <Typography variant="h6" gutterBottom>{t('dashboard.transactions', 'Transacciones')}</Typography>
              <Typography variant="body1">{t('dashboard.count', 'Cantidad')}: <b>{stats.transactions?.count ?? 0}</b></Typography>
            </Paper>
          </Grid>
          <Grid gridColumn="span 3">
            <Paper sx={{ p: 3, textAlign: 'center' }} elevation={3}>
              <Typography variant="h6" gutterBottom>{t('dashboard.reports', 'Reportes')}</Typography>
              <Typography variant="body1">{t('dashboard.count', 'Cantidad')}: <b>{stats.reports?.count ?? 0}</b></Typography>
            </Paper>
          </Grid>
          <Grid gridColumn="span 12">
            <Paper sx={{ p: 3, textAlign: 'center', mt: 2 }} elevation={3}>
              <Typography variant="h6" gutterBottom>{t('dashboard.usersByRole', 'Usuarios por rol')}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                {stats.stats?.usersByRole && Object.entries(stats.stats.usersByRole ?? {}).map(([role, count]) => (
                  <Box key={role} sx={{ mx: 2 }}>
                    <Typography variant="subtitle1" color="primary"><b>{t(`roles.${role}`, role)}</b></Typography>
                    <Typography variant="body2">{t('dashboard.count', 'Cantidad')}: <b>{count}</b></Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;
