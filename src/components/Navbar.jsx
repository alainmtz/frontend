
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Box, Button } from '@mui/material';

function UserMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setAnchorEl(null);
    window.location.href = '/login';
  };
  return (
    <>
      <IconButton onClick={handleClick} color="inherit" aria-label="User menu">
        <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MenuItem onClick={handleClose}>Perfil</MenuItem>
        <MenuItem onClick={handleClose}>Configuración</MenuItem>
        <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
      </Menu>
    </>
  );
}

export default function Navbar() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  let roles = [];
  let tokenValid = true;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      roles = Array.isArray(payload.roles) ? payload.roles : [];
    } catch {
      tokenValid = false;
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
  return (
    <AppBar position="fixed" color="primary" elevation={2} sx={{ zIndex: 1201 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
          Fulltime WebApp
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {token && tokenValid ? (
            <>
              <Button color="inherit" href="/store">Tienda</Button>
              <Button color="inherit" href="/transactions">Transacciones</Button>
              <Button color="inherit" href="/financial-reports">Reportes Financieros</Button>
              {roles.includes('admin') && (
                <Button color="inherit" href="/roles-management">Gestión de Roles</Button>
              )}
              <UserMenu />
            </>
          ) : (
            <Button color="inherit" href="/login">Iniciar sesión</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
