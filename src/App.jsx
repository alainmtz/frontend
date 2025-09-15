import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AuthContext } from './context/AuthContext';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/profile/Profile';
import Roles from './pages/roles/Roles';
import Finances from './pages/finances/Finances';
import Reports from './pages/reports/Reports';
import ItemsPage from './pages/items';
import PrivateRoute from './components/PrivateRoute';
import TransactionsPage from './pages/transactions/TransactionsPage';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProviderCustom, ThemeContext } from './context/ThemeContext';

// Componente para proteger rutas solo para admin (fuera de App)
function AdminOnly({ children }) {
  const { user } = useContext(AuthContext);
  if (!user || !user.token) return null;
  try {
    const payload = JSON.parse(atob(user.token.split('.')[1]));
    if (payload.roles && (payload.roles.includes('admin') || payload.roles.includes('Admin'))) {
      return children;
    }
  } catch (e) {}
  return <div style={{ padding: 32, textAlign: 'center' }}>No autorizado</div>;
}

const App = () => {
  return (
    <ThemeProviderCustom>
      {(theme) => (
        <ThemeContext.Consumer>
          {({ mode, toggleMode }) => (
            <>
              <CssBaseline />
              <AuthProvider>
                <Router>
                  <NavBar toggleMode={toggleMode} mode={mode} />
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={
                      <PrivateRoute>
                        <AdminOnly>
                          <Register />
                        </AdminOnly>
                      </PrivateRoute>
                    } />
                    <Route path="/forgot" element={<ForgotPassword />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="/roles" element={<PrivateRoute><Roles /></PrivateRoute>} />
                    <Route path="/finances" element={<PrivateRoute><Finances /></PrivateRoute>} />
                    <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
                    <Route path="/items" element={<PrivateRoute><ItemsPage /></PrivateRoute>} />
                    <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
                  </Routes>
                </Router>
              </AuthProvider>
            </>
          )}
        </ThemeContext.Consumer>
      )}
    </ThemeProviderCustom>
  );
};

export default App;
