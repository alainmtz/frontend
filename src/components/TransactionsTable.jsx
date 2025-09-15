import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

export default function TransactionsTable({ transactions, onEdit, onDelete, loading }) {
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('transactions.id', 'ID')}</TableCell>
            <TableCell>{t('transactions.type', 'Tipo')}</TableCell>
            <TableCell>{t('transactions.amount', 'Monto')}</TableCell>
            <TableCell>{t('transactions.date', 'Fecha')}</TableCell>
            <TableCell>{t('transactions.actions', 'Acciones')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={5}>{t('transactions.loading', 'Cargando...')}</TableCell></TableRow>
          ) : transactions.length === 0 ? (
            <TableRow><TableCell colSpan={5}>{t('transactions.empty', 'Sin transacciones')}</TableCell></TableRow>
          ) : (
            transactions.map(tx => (
              <TableRow key={tx.id}>
                <TableCell>{tx.id}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.amount}</TableCell>
                <TableCell>{tx.date}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => onEdit(tx)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => onDelete(tx.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
