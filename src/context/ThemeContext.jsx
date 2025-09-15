import React, { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

const darkBlue = '#0A1828';
const turquoise = '#178582';
const gold = '#BFA181';

export const ThemeContext = createContext();

export const ThemeProviderCustom = ({ children }) => {
  const [mode, setMode] = useState('dark');

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: darkBlue, contrastText: '#fff' },
      secondary: { main: turquoise, contrastText: '#fff' },
      warning: { main: gold, contrastText: '#fff' },
      background: {
        default: mode === 'dark' ? darkBlue : '#fff',
        paper: mode === 'dark' ? '#16213E' : '#f5f5f5',
      },
      text: {
        primary: mode === 'dark' ? '#fff' : darkBlue,
        secondary: gold,
      },
    },
  }), [mode]);

  const toggleMode = () => setMode(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children(theme)}
    </ThemeContext.Provider>
  );
};
