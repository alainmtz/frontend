import React, { useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/users', {
        first_name: firstName,
        last_name: lastName,
        email,
        password
      });
      // Si quieres iniciar sesión automáticamente, puedes redirigir a login o dashboard
      navigate('/login');
    } catch (err) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
  <Typography variant="h4" align="center" gutterBottom>{t('register.title', 'Registro')}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label={t('register.first_name', 'Nombre')}
            type="text"
            fullWidth
            margin="normal"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
          <TextField
            label={t('register.last_name', 'Apellido')}
            type="text"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
          <TextField
            label={t('register.email', 'Email')}
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label={t('register.password', 'Contraseña')}
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2 }}>{t('register.button', 'Registrarse')}</Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="/login" underline="hover">{t('register.login', '¿Ya tienes cuenta? Inicia sesión')}</Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
