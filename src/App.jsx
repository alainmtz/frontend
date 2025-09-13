import RolesManagement from './pages/RolesManagement';
              <Route path="/roles-management" element={<ProtectedRoute><RolesManagement /></ProtectedRoute>} />
import './index.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Box } from '@mui/material';

import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import Suppliers from './pages/Suppliers';
import Transactions from './pages/Transactions';
import ActivityLog from './pages/ActivityLog';
import StockHistory from './pages/StockHistory';
import Products from './pages/Products';
import Projects from './pages/Projects';
import NotFound from './pages/NotFound';
import Consumibles from './pages/Consumibles';
import Store from './pages/Store';
import Purchases from './pages/Purchases';

import FinancialReports from './pages/FinancialReports';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.100' }}>
        <Navbar />
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <Box component="main" sx={{ flex: 1, bgcolor: 'grey.100', minHeight: '100vh', pt: 8, pl: { md: 32 } }}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
                <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
                <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                <Route path="/activity-log" element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
                <Route path="/stock-history" element={<ProtectedRoute><StockHistory /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                <Route path="/consumibles" element={<ProtectedRoute><Consumibles /></ProtectedRoute>} />
                <Route path="/store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
                <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
                <Route path="/financial-reports" element={<ProtectedRoute><FinancialReports /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;

