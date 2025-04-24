import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#283593',
    },
    background: {
      default: '#f5f7fa',
      paper: '#fff',
    },
    text: {
      primary: '#283593',
      secondary: '#1976d2',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'background 0.2s',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#bbdefb',
    },
    background: {
      default: '#181c25',
      paper: '#23273a',
    },
    text: {
      primary: '#e3eafc',
      secondary: '#90caf9',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'background 0.2s',
        },
      },
    },
  },
});

export default theme;
