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
              <Route path="/" element={<Dashboard />} />
              <Route path="/items" element={<Items />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/activity-log" element={<ActivityLog />} />
              <Route path="/stock-history" element={<StockHistory />} />
              <Route path="/products" element={<Products />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/consumibles" element={<Consumibles />} />
              <Route path="/store" element={<Store />} />
              <Route path="/purchases" element={<Purchases />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;

