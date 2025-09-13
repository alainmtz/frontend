
import React, { useState } from 'react';
import { Drawer, Box, Typography, IconButton, Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Dashboard', href: '/' },
  { label: 'Articulos', href: '/items' },
  { label: 'Consumibles', href: '/consumibles' },
  { label: 'Compras', href: '/purchases' },
  { label: 'Productos', href: '/products' },
  { label: 'Proveedores', href: '/suppliers' },
  { label: 'Transacciones', href: '/transactions' },
  { label: 'Registro de Actividad', href: '/activity-log' },
  { label: 'Historial de Stock', href: '/stock-history' },
  { label: 'Proyectos', href: '/projects' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleNavigate = (href) => {
    navigate(href);
    setOpen(false);
  };
  return (
    <>
      {/* Botón flotante para abrir sidebar en móviles */}
      <IconButton
        sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1300, bgcolor: 'primary.main', color: 'white', display: { md: 'none' } }}
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ zIndex: 1200, display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 260, pt: 2, px: 2, bgcolor: 'primary.main', color: 'white', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }} aria-label="Cerrar menú">
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navLinks.map(link => (
              <ListItem key={link.href} disablePadding>
                <ListItemButton onClick={() => handleNavigate(link.href)} sx={{ color: 'white' }}>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Sidebar permanente en desktop */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: 260, bgcolor: 'primary.main', color: 'white', pt: 8, px: 2, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', zIndex: 1100 }}>
        <List>
          {navLinks.map(link => (
            <ListItem key={link.href} disablePadding>
              <ListItemButton onClick={() => handleNavigate(link.href)} sx={{ color: 'white' }}>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}
