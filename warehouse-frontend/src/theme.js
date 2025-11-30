import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F97316',      // Orange
      light: '#FB923C',
      dark: '#EA580C',
      contrastText: '#fff',
    },
    secondary: {
      main: '#F59E0B',      // Amber
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#fff',
    },
    background: {
      default: '#FFF7ED',   // Light warm background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',   // Dark Gray
      secondary: '#6B7280',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none', // 0
    '0px 1px 2px rgba(249,115,22,0.05)', // 1
    '0px 1px 3px rgba(249,115,22,0.1)', // 2
    '0px 1px 5px rgba(249,115,22,0.1)', // 3
    '0px 2px 6px rgba(249,115,22,0.12)', // 4
    '0px 3px 8px rgba(249,115,22,0.15)', // 5
    '0px 4px 10px rgba(249,115,22,0.15)', // 6
    '0px 5px 12px rgba(249,115,22,0.18)', // 7
    '0px 6px 14px rgba(249,115,22,0.2)', // 8
    '0px 7px 16px rgba(249,115,22,0.22)', // 9
    '0px 8px 18px rgba(249,115,22,0.24)', // 10
    '0px 9px 20px rgba(249,115,22,0.26)', // 11
    '0px 10px 22px rgba(249,115,22,0.28)', // 12
    '0px 11px 24px rgba(249,115,22,0.3)', // 13
    '0px 12px 26px rgba(249,115,22,0.32)', // 14
    '0px 13px 28px rgba(249,115,22,0.34)', // 15
    '0px 14px 30px rgba(249,115,22,0.36)', // 16
    '0px 15px 32px rgba(249,115,22,0.38)', // 17
    '0px 16px 34px rgba(249,115,22,0.4)', // 18
    '0px 17px 36px rgba(249,115,22,0.42)', // 19
    '0px 18px 38px rgba(249,115,22,0.44)', // 20
    '0px 19px 40px rgba(249,115,22,0.46)', // 21
    '0px 20px 42px rgba(249,115,22,0.48)', // 22
    '0px 21px 44px rgba(249,115,22,0.5)', // 23
    '0px 22px 46px rgba(249,115,22,0.52)', // 24
    // ... rest of shadows
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0px 4px 12px rgba(249, 115, 22, 0.3)',
          '&:hover': {
            boxShadow: '0px 8px 20px rgba(249, 115, 22, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;