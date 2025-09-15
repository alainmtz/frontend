import { createTheme } from '@mui/material/styles';

const darkBlue = '#0A1828';
const turquoise = '#178582';
const gold = '#BFA181';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: darkBlue,
      contrastText: '#fff',
    },
    secondary: {
      main: turquoise,
      contrastText: '#fff',
    },
    warning: {
      main: gold,
      contrastText: '#fff',
    },
    background: {
      default: darkBlue,
      paper: '#16213E',
    },
    text: {
      primary: '#fff',
      secondary: gold,
    },
  },
});

export default theme;
