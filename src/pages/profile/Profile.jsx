
import React, { useContext } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ProfileCard from '../../components/ProfileCard';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const handleEditPhoto = () => {
    // lógica para cambiar foto
  };
  const handleSave = () => {
    // lógica para guardar cambios
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10 }}>
        <Typography variant="h4" align="center" gutterBottom>{t('profile.title', 'Perfil de Usuario')}</Typography>
        <ProfileCard user={user} onEditPhoto={handleEditPhoto} onSave={handleSave} />
      </Box>
    </Container>
  );
};

export default Profile;
