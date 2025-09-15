import React, { useState } from 'react';
import api from '../../utils/api';
import { Container, Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await api.post('/api/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError('No se pudo enviar el enlace');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" align="center" gutterBottom>{t('forgot.title', 'Recuperar Contraseña')}</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{t('forgot.success', 'Enlace enviado a tu correo')}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{t('forgot.error', error || 'No se pudo enviar el enlace')}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label={t('forgot.email', 'Email')}
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="warning" fullWidth sx={{ mt: 2 }}>{t('forgot.button', 'Enviar enlace')}</Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="/login" underline="hover">{t('forgot.login', 'Volver a iniciar sesión')}</Link>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
