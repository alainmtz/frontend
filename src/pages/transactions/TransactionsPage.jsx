import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import useTransactions from '../../hooks/useTransactions';
import TransactionsCards from '../../components/TransactionsCards';
import TransactionForm from '../../components/TransactionForm';
import { Box, Typography, Snackbar, Alert, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function TransactionsPage() {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions(user?.token);

  const [editing, setEditing] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCreate = async (data) => {
    try {
      await createTransaction(data);
      setSnackbar({ open: true, message: t('transactions.created', 'Transacción creada'), severity: 'success' });
      setEditing(null);
    } catch {
      setSnackbar({ open: true, message: t('transactions.error.create', 'Error al crear'), severity: 'error' });
    }
  };

  const handleEdit = (tx) => setEditing(tx);

  const handleUpdate = async (data) => {
    try {
      await updateTransaction(editing.id, data);
      setSnackbar({ open: true, message: t('transactions.updated', 'Transacción actualizada'), severity: 'success' });
      setEditing(null);
    } catch {
      setSnackbar({ open: true, message: t('transactions.error.update', 'Error al actualizar'), severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setSnackbar({ open: true, message: t('transactions.deleted', 'Transacción eliminada'), severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: t('transactions.error.delete', 'Error al eliminar'), severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>{t('transactions.title', 'Transacciones')}</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setEditing({})}>{t('transactions.new', 'Nueva transacción')}</Button>
      {editing && (
        <TransactionForm
          initialData={editing.id ? editing : null}
          onSubmit={editing.id ? handleUpdate : handleCreate}
          onCancel={() => setEditing(null)}
          loading={loading}
        />
      )}
      <TransactionsCards
        transactions={transactions}
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
