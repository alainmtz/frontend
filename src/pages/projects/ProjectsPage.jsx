import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import useProjects from '../../hooks/useProjects';
import ProjectsCards from '../../components/ProjectsCards';
import ProjectForm from '../../components/ProjectForm';
import { Box, Typography, Snackbar, Alert, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ProjectsPage() {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects(user?.token);

  const [editing, setEditing] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCreate = async (data) => {
    try {
      await createProject(data);
      setSnackbar({ open: true, message: t('projects.created', 'Proyecto creado'), severity: 'success' });
      setEditing(null);
    } catch {
      setSnackbar({ open: true, message: t('projects.error.create', 'Error al crear'), severity: 'error' });
    }
  };

  const handleEdit = (project) => setEditing(project);

  const handleUpdate = async (data) => {
    try {
      await updateProject(editing.id, data);
      setSnackbar({ open: true, message: t('projects.updated', 'Proyecto actualizado'), severity: 'success' });
      setEditing(null);
    } catch {
      setSnackbar({ open: true, message: t('projects.error.update', 'Error al actualizar'), severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setSnackbar({ open: true, message: t('projects.deleted', 'Proyecto eliminado'), severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: t('projects.error.delete', 'Error al eliminar'), severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>{t('projects.title', 'Proyectos')}</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setEditing({})}>{t('projects.new', 'Nuevo proyecto')}</Button>
      {editing && (
        <ProjectForm
          initialData={editing.id ? editing : null}
          onSubmit={editing.id ? handleUpdate : handleCreate}
          onCancel={() => setEditing(null)}
          loading={loading}
        />
      )}
      <ProjectsCards
        projects={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
