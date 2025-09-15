
import { useState, useEffect } from 'react';
import api from '../utils/api';


export default function useItems(token) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);

  const fetchItems = async (customPage = page, customLimit = limit) => {
    setLoading(true);
    try {
      const res = await api.get('/api/items', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: customPage, limit: customLimit }
      });
      setItems(res.data.items);
      setTotal(res.data.total);
      setPage(res.data.page);
      setLimit(res.data.limit);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.filter(item => item.id !== id));
      return { success: true };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    }
  };

  const editItem = async (id, data) => {
    try {
      const res = await api.put(`/api/items/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.map(item => item.id === id ? res.data.item : item));
      return { success: true };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    fetchItems(page, limit);
    // eslint-disable-next-line
  }, [token, page, limit]);

  const goToPage = (newPage) => {
    setPage(newPage);
    fetchItems(newPage, limit);
  };
  const changeLimit = (newLimit) => {
    setLimit(newLimit);
    fetchItems(1, newLimit);
  };

  return { items, loading, error, fetchItems, deleteItem, editItem, page, limit, total, goToPage, changeLimit };
}
