import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/auth/login', { email, password });
      // Guardar token y refreshToken y redirigir
      login(res.data.token, res.data.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
  <Typography variant="h4" align="center" gutterBottom>{t('login.title')}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label={t('login.email')}
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label={t('login.password')}
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>{t('login.button')}</Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="/register" underline="hover">{t('login.register')}</Link>
        </Box>
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Link href="/forgot" underline="hover" color="text.secondary">{t('login.forgot')}</Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
