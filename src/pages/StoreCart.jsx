import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { purchaseCart } from '../services/storeService';

export default function StoreCart({ cart, setCart, setShowCart }) {
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientData, setClientData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    identidad: '',
    serie: '',
    garantia: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleQuantity = (id, delta) => {
    setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p));
  };
  const handleRemove = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };
  const handlePurchase = () => {
    setShowClientForm(true);
  };

  const handleClientFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Enviar datos de compra y cliente al backend
      await purchaseCart({
        cart,
        cliente: clientData
      });
      setMessage('Compra realizada con éxito');
      exportFactura();
      setCart([]);
      setShowClientForm(false);
    } catch (err) {
      setMessage('Error al procesar la compra');
    }
    setLoading(false);
  };

  // Exportar factura como PDF
  const exportFactura = () => {
    const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2);
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    doc.text('Factura de Compra', 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Cliente:`, 20, y);
    y += 8;
    doc.text(`Nombre: ${clientData.nombre}`, 20, y);
    y += 8;
    doc.text(`Teléfono: ${clientData.telefono}`, 20, y);
    y += 8;
    doc.text(`Dirección: ${clientData.direccion}`, 20, y);
    y += 8;
    doc.text(`Identidad: ${clientData.identidad}`, 20, y);
    y += 8;
    doc.text(`Serie Artículo: ${clientData.serie}`, 20, y);
    y += 8;
    doc.text(`Garantía: ${clientData.garantia}`, 20, y);
    y += 12;
    doc.text('Artículos:', 20, y);
    y += 8;
    cart.forEach(p => {
      doc.text(`- ${p.name} (SKU: ${p.sku}) x${p.quantity} - $${p.price}`, 22, y);
      y += 8;
    });
    y += 8;
    doc.text(`Total: $${total}`, 20, y);
    doc.save(`factura_${Date.now()}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Carrito de Compras</h2>
        {cart.length === 0 ? (
          <div className="text-gray-500">El carrito está vacío</div>
        ) : (
          <ul className="mb-4">
            {cart.map(p => (
              <li key={p.id} className="flex justify-between items-center mb-2">
                <span>{p.name} (${p.price}) x {p.quantity}</span>
                <div className="flex gap-2">
                  <button className="bg-gray-300 px-2 rounded" onClick={() => handleQuantity(p.id, -1)}>-</button>
                  <button className="bg-gray-300 px-2 rounded" onClick={() => handleQuantity(p.id, 1)}>+</button>
                  <button className="bg-red-500 text-white px-2 rounded" onClick={() => handleRemove(p.id)}>Quitar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="font-bold mb-4">Total: ${cart.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2)}</div>
        {message && <div className="mb-2 text-green-700">{message}</div>}
        <div className="flex gap-2 mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handlePurchase} disabled={loading || cart.length === 0}>Comprar</button>
          <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={() => setShowCart(false)}>Cerrar</button>
        </div>
        {/* Modal de datos del cliente */}
        {showClientForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setShowClientForm(false)}
                aria-label="Cerrar"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-center">Datos del Cliente</h2>
              <form onSubmit={handleClientFormSubmit}>
                <div className="mb-2">
                  <label className="block font-bold mb-1">Nombre</label>
                  <input type="text" className="border px-2 py-1 w-full" value={clientData.nombre} onChange={e => setClientData({ ...clientData, nombre: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="block font-bold mb-1">Teléfono</label>
                  <input type="text" className="border px-2 py-1 w-full" value={clientData.telefono} onChange={e => setClientData({ ...clientData, telefono: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="block font-bold mb-1">Dirección</label>
                  <input type="text" className="border px-2 py-1 w-full" value={clientData.direccion} onChange={e => setClientData({ ...clientData, direccion: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="block font-bold mb-1">Identidad</label>
                  <input type="text" className="border px-2 py-1 w-full" value={clientData.identidad} onChange={e => setClientData({ ...clientData, identidad: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="block font-bold mb-1">Serie del artículo</label>
                  <input type="text" className="border px-2 py-1 w-full" value={clientData.serie} onChange={e => setClientData({ ...clientData, serie: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="block font-bold mb-1">Tiempo de garantía</label>
                  <input type="text" className="border px-2 py-1 w-full" value={clientData.garantia} onChange={e => setClientData({ ...clientData, garantia: e.target.value })} required />
                </div>
                <div className="flex gap-2 mt-4 justify-center">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Finalizar compra y exportar factura</button>
                  <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowClientForm(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
