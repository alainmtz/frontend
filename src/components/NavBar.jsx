import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box, Select, MenuItem, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const NavBar = ({ toggleMode, mode }) => {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  // Decodificar roles del token JWT
  let isAdmin = false;
  if (user && user.token) {
    try {
      const payload = JSON.parse(atob(user.token.split('.')[1]));
      if (payload.roles && (payload.roles.includes('admin') || payload.roles.includes('Admin'))) {
        isAdmin = true;
      }
    } catch {}
  }
  const pages = [
    { label: t('navbar.dashboard'), path: '/dashboard' },
    { label: t('navbar.profile'), path: '/profile' },
    { label: t('navbar.roles'), path: '/roles' },
    { label: t('navbar.finances'), path: '/finances' },
    { label: t('navbar.transactions', 'Transacciones'), path: '/transactions' },
    { label: t('navbar.items', 'Items'), path: '/items' },
    { label: t('navbar.reports'), path: '/reports' },
    ...(isAdmin ? [{ label: t('navbar.register', 'Registrar usuario'), path: '/register' }] : [])
  ];
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [lang, setLang] = React.useState(localStorage.getItem('lang') || 'es');
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLangChange = (e) => {
    setLang(e.target.value);
    localStorage.setItem('lang', e.target.value);
    i18n.changeLanguage(e.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1, mb: 4 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('navbar.appname')}
          </Typography>
          <Select value={lang} onChange={handleLangChange} size="small" sx={{ mr: 2, color: 'inherit', bgcolor: 'transparent' }}>
            <MenuItem value="es">Español</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
          <Tooltip title={mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
            <IconButton color="inherit" onClick={toggleMode} sx={{ mr: 2 }}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          {pages.map(page => (
            <Button key={page.path} color="inherit" onClick={() => handleNav(page.path)} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
              {page.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 220 }}>
          {pages.map(page => (
            <ListItem key={page.path} button onClick={() => handleNav(page.path)}>
              <ListItemText primary={page.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default NavBar;
