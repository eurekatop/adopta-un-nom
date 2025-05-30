import { createGlobalTheme, createThemeContract } from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    primary: '',
    primaryHover: '',
    secondary: '',
    secondaryHover: '',
    text: '',
    background: '',
  },
  font: {
    body: '',
    heading: '',
    base: '',
  },
  space: {
    sm: '',
    md: '',
    lg: '',
  },
  radius: {
    sm: '',
    md: '',
    lg: '',
  },
  shadow: {
    sm: '',
    md: '',
    lg: '',
  }
});

// Set actual values globally (you can also make multiple themes later)
export const lightThemeClass = createGlobalTheme('.light-theme', vars, {
  color: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#d1d5db',
    secondaryHover: '#a0aec0',
    text: '#1f2937',
    background: '#ffffff',
  },
  font: {
    body: 'system-ui, sans-serif',
    heading: 'Georgia, serif',
    base: '16px',
  },
  space: {
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
  shadow: {
    sm: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    md: 'var(--shadow-md)', // You can reference other theme variables here
    lg: 'var(--shadow-lg)',
  }
});


export const darkThemeClass = createGlobalTheme('.dark-theme', vars, {
  color: {
    primary: '#0ea5e9',
    primaryHover: '#0369a1',
    secondary: '#374151',
    secondaryHover: '#1c3141',
    text: '#f9fafb',
    background: '#111827',
  },
  font: {
    body: 'system-ui, sans-serif',
    heading: 'Georgia, serif',
    base: '16px',
  },
  space: {
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
  shadow: {
    sm: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    md: 'var(--shadow-md)', // You can reference other theme variables here
    lg: 'var(--shadow-lg)',
  }
});