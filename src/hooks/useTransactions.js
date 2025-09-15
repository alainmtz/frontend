import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export default function useTransactions(token) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }, [token]);

  const createTransaction = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/transactions', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/api/transactions/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(prev => prev.map(t => t.id === id ? res.data : t));
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token, fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
