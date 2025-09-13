import React from 'react';
import { Box, Typography } from '@mui/material';

export default function NotFound() {
  return (
  <Box sx={{ p: { xs: 2, md: 6 }, mt: { xs: 2, md: 6 }, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h3" fontWeight={700} color="error" mb={4}>
        404 - Página no encontrada
      </Typography>
      <Typography variant="body1">La página que buscas no existe.</Typography>
    </Box>
  );
}
