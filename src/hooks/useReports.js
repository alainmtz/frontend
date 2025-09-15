import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/reports')
      .then(res => {
        setReports(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { reports, loading, error };
}
