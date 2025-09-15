import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

export default function ProjectsTable({ projects, onEdit, onDelete, loading }) {
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('projects.id', 'ID')}</TableCell>
            <TableCell>{t('projects.name', 'Nombre')}</TableCell>
            <TableCell>{t('projects.status', 'Estado')}</TableCell>
            <TableCell>{t('projects.startDate', 'Inicio')}</TableCell>
            <TableCell>{t('projects.endDate', 'Fin')}</TableCell>
            <TableCell>{t('projects.actions', 'Acciones')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={6}>{t('projects.loading', 'Cargando...')}</TableCell></TableRow>
          ) : projects.length === 0 ? (
            <TableRow><TableCell colSpan={6}>{t('projects.empty', 'Sin proyectos')}</TableCell></TableRow>
          ) : (
            projects.map(project => (
              <TableRow key={project.id}>
                <TableCell>{project.id}</TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>{project.startDate}</TableCell>
                <TableCell>{project.endDate}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => onEdit(project)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => onDelete(project.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
