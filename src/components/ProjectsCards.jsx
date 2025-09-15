import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

export default function ProjectsCards({ projects, onEdit, onDelete, loading }) {
  const { t } = useTranslation();
  if (loading) return <Typography>{t('projects.loading', 'Cargando...')}</Typography>;
  if (!projects.length) return <Typography>{t('projects.empty', 'Sin proyectos')}</Typography>;
  return (
    <Grid container spacing={2}>
      {projects.map(project => (
        <Grid item xs={12} sm={6} md={4} key={project.id}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>{project.name}</Typography>
              <Typography>{t('projects.status', 'Estado')}: {project.status}</Typography>
              <Typography>{t('projects.startDate', 'Inicio')}: {project.startDate}</Typography>
              <Typography>{t('projects.endDate', 'Fin')}: {project.endDate}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <IconButton color="primary" onClick={() => onEdit(project)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => onDelete(project.id)}><DeleteIcon /></IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
