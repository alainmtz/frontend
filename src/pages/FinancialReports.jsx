import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

const FinancialReports = () => {
  const [reports, setReports] = useState([]);
  const [period, setPeriod] = useState('');
  const [type, setType] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/reports', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return [];
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setReports(data);
        } else {
          setReports([]);
        }
      })
      .catch(() => setReports([]));
  }, []);

  useEffect(() => {
     let result = Array.isArray(reports) ? reports : [];
     if (period) result = result.filter(r => r.period === period);
     if (type) result = result.filter(r => r.type === type);
     setFiltered(result);
  }, [period, type, reports]);

  // Example chart data (adapt to your report data structure)
  const chartData = {
    labels: filtered.map(r => r.period),
    datasets: [
      {
        label: 'Monto total',
        data: filtered.map(r => r.data.total || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Reportes Financieros</h2>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Filtrar por periodo (ej: 2025-09)"
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Filtrar por tipo (financiero, inventario, etc)"
          value={type}
          onChange={e => setType(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
      <Chart type="bar" data={chartData} />
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Datos agregados</h3>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Periodo</th>
              <th className="border px-2 py-1">Tipo</th>
              <th className="border px-2 py-1">Monto Total</th>
              <th className="border px-2 py-1">Fecha Creación</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td className="border px-2 py-1">{r.period}</td>
                <td className="border px-2 py-1">{r.type}</td>
                <td className="border px-2 py-1">{r.data.total || '-'}</td>
                <td className="border px-2 py-1">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialReports;
