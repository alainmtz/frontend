import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export default function useProjects(token) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }, [token]);

  const createProject = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/projects', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/api/projects/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(prev => prev.map(p => p.id === id ? res.data : p));
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProjects();
  }, [token, fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
