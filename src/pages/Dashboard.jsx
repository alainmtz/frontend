
import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

export default function Dashboard() {
  return (
  <Box sx={{ p: { xs: 2, md: 6 }, mt: { xs: 2, md: 6 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={4}>Dashboard</Typography>
      <Grid container spacing={3} columns={12}>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>Items</Typography>
              <Typography>Resumen de inventario y productos.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>Suppliers</Typography>
              <Typography>Resumen de proveedores.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>Transacciones</Typography>
              <Typography>Resumen de ventas y compras.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
