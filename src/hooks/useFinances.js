import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function useFinances(token) {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/api/finances', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setFinances(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [token]);

  return { finances, loading, error };
}
