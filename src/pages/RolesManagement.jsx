import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemButton, ListItemText, Divider, Select, MenuItem, Button, Alert } from '@mui/material';

const RolesManagement = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/roles', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (res.status === 401 || res.status === 403) {
          alert('Sesión expirada o permisos insuficientes. Por favor, inicia sesión nuevamente.');
          localStorage.removeItem('token');
          window.location.href = '/login';
          return [];
        }
        const data = await res.json();
        setRoles(Array.isArray(data) ? data : []);
      });
    fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (res.status === 401 || res.status === 403) {
          alert('Sesión expirada o permisos insuficientes. Por favor, inicia sesión nuevamente.');
          localStorage.removeItem('token');
          window.location.href = '/login';
          return [];
        }
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      });
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || '');
    setMessage('');
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSave = async () => {
    if (!selectedUser || !selectedRole) return;
    setMessage('');
    try {
      const res = await fetch(`/api/users/${selectedUser.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: selectedRole })
      });
      if (res.ok) {
        setMessage('Rol actualizado correctamente');
      } else {
        setMessage('Error al actualizar el rol');
      }
    } catch {
      setMessage('Error de conexión');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
      <Paper elevation={3} sx={{ p: 4, width: 700 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>Gestión de Roles y Perfiles</Typography>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ width: '45%' }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>Usuarios</Typography>
            <List sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
              {users.map(user => (
                <ListItem key={user.id} disablePadding>
                  <ListItemButton selected={selectedUser?.id === user.id} onClick={() => handleUserSelect(user)}>
                    <ListItemText primary={user.name || user.email} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ width: '55%' }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>Editar rol</Typography>
            {selectedUser ? (
              <Box>
                <Typography mb={2}>Usuario: <b>{selectedUser.name || selectedUser.email}</b></Typography>
                <Select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  fullWidth
                  displayEmpty
                  sx={{ mb: 3 }}
                >
                  <MenuItem value="">Selecciona un rol</MenuItem>
                  {roles.map(role => (
                    <MenuItem key={role.id || role} value={role.name || role}>{role.name || role}</MenuItem>
                  ))}
                </Select>
                <Button variant="contained" color="primary" onClick={handleSave} sx={{ fontWeight: 600 }}>Guardar</Button>
                {message && <Alert severity="success" sx={{ mt: 3 }}>{message}</Alert>}
              </Box>
            ) : (
              <Typography color="text.secondary">Selecciona un usuario para editar su rol.</Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RolesManagement;
