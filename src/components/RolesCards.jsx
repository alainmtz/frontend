import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

export default function RolesCards({ roles, onEdit, onDelete, loading }) {
  const { t } = useTranslation();
  if (loading) return <Typography>{t('roles.loading', 'Cargando...')}</Typography>;
  if (!roles.length) return <Typography>{t('roles.empty', 'Sin roles')}</Typography>;
  return (
    <Grid container spacing={2}>
      {roles.map(role => (
        <Grid item xs={12} sm={6} md={4} key={role.id}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>{role.name}</Typography>
              <Typography>{t('roles.id', 'ID')}: {role.id}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <IconButton color="primary" onClick={() => onEdit(role)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => onDelete(role.id)}><DeleteIcon /></IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
