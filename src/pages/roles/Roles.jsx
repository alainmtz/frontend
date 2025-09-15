import React, { useState } from 'react';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import RolesCards from '../../components/RolesCards';
import { useTranslation } from 'react-i18next';

const Roles = () => {
  const { t } = useTranslation();
  const [roles] = useState([
    { id: 1, name: t('roles.admin', 'Administrador') },
    { id: 2, name: t('roles.user', 'Usuario') },
    { id: 3, name: t('roles.guest', 'Invitado') },
  ]);
  const [filter, setFilter] = useState('');
  const filteredRoles = roles.filter(role => role.name.toLowerCase().includes(filter.toLowerCase()));
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 10, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" align="center" gutterBottom>{t('roles.title', 'Gestión de Roles')}</Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>{t('roles.add', 'Agregar Rol')}</Button>
        <TextField
          label={t('roles.filter', 'Filtrar por nombre')}
          value={filter}
          onChange={e => setFilter(e.target.value)}
          fullWidth
          margin="normal"
        />
        <RolesCards
          roles={filteredRoles}
          onEdit={r => {}}
          onDelete={id => {}}
          loading={false}
        />
      </Box>
    </Container>
  );
};

export default Roles;
