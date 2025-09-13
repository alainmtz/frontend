import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { getTransactions } from '../services/transactionsService';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    getTransactions().then(data => {
      // Normaliza los datos para mostrar campos clave
      const normalized = Array.isArray(data) ? data.map(tx => ({
        id: tx.id,
        fecha: tx.transaction_date ? new Date(tx.transaction_date).toLocaleString() : '-',
        tipo: tx.type,
        cantidad: tx.quantity,
        precio: tx.price,
        item: tx.item?.name || '-',
        usuario: tx.user?.name || '-',
        notas: tx.notes || '',
      })) : [];
      setTransactions(normalized);
    });
  }, []);

  // Exportar una sola transacción
  const exportSinglePDF = (tx) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Detalles de la Transacción', 10, 10);
    doc.setFontSize(12);
    let y = 20;
    Object.entries(tx).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 10, y);
      y += 8;
    });
    doc.save(`transaccion_${tx.id || 'single'}.pdf`);
  };

  // Exportar todas las transacciones en rango
  const exportRangePDF = () => {
    const filtered = transactions.filter(tx => {
      const date = new Date(tx.fecha);
      return (!startDate || date >= new Date(startDate)) && (!endDate || date <= new Date(endDate));
    });
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reporte de Transacciones', 10, 10);
    doc.setFontSize(12);
    let y = 20;
    filtered.forEach((tx, idx) => {
      doc.text(`Transacción #${tx.id || idx + 1}`, 10, y);
      y += 8;
      Object.entries(tx).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 15, y);
        y += 7;
      });
      y += 5;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save(`transacciones_${startDate || 'all'}_${endDate || 'all'}.pdf`);
  };

  return (
    <div className="p-8 mt-12">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <span className="mx-2">a</span>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded shadow"
          onClick={exportRangePDF}
        >Export Range PDF</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {transactions.map(tx => (
          <div key={tx.id} className="bg-white shadow rounded p-4 flex flex-col">
            <div className="font-bold">ID: {tx.id}</div>
            <div>Fecha: {tx.fecha}</div>
            <div>Tipo: {tx.tipo}</div>
            <div>Cantidad: {tx.cantidad}</div>
            <div>Precio: ${tx.precio}</div>
            <div>Item: {tx.item}</div>
            <div>Usuario: {tx.usuario}</div>
            <div>Notas: {tx.notas}</div>
            <button
              className="mt-4 bg-blue-600 text-white px-3 py-1 rounded self-end"
              onClick={() => exportSinglePDF(tx)}
            >Exportar PDF</button>
          </div>
        ))}
      </div>
    </div>
  );
}
