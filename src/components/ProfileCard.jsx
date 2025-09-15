import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Link, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ProfileCard({ user, onEditPhoto, onSave }) {
  const { t } = useTranslation();
  return (
    <Card variant="outlined" sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar src={user?.avatar || '/default-avatar.png'} sx={{ width: 80, height: 80, mb: 1 }} />
          <Link href="#" underline="hover" color="primary" onClick={onEditPhoto}>{t('profile.changePhoto', 'Cambiar foto')}</Link>
        </Box>
        <Typography variant="h6" align="center" gutterBottom>{user?.name || t('profile.defaultName', 'Usuario')}</Typography>
        <Typography align="center" color="textSecondary">{user?.email}</Typography>
        {user?.phone && <Typography align="center" color="textSecondary">{user.phone}</Typography>}
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={onSave}>{t('profile.save', 'Guardar cambios')}</Button>
      </CardContent>
    </Card>
  );
}
