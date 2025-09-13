import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Link, Alert } from '@mui/material';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
        setEmail(''); setPassword(''); setName('');
      } else {
        setError(data.message || 'No se pudo registrar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>Registro</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontWeight: 600 }}>Registrarse</Button>
        </Box>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link href="/login" underline="hover" color="primary">¿Ya tienes cuenta? Inicia sesión</Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
