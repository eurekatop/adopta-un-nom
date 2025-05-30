import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';


export const card = style({
  background: vars.color?.background ?? '#fff',
  borderRadius: '0.75rem',
  boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease',
  selectors: {
    '&:hover': {
      transform: 'scale(1.01)',
    },
  },
});

export const cardImage = style({
  width: '100%',
  height: '180px',
  objectFit: 'contain',
});

export const cardContent = style({
  padding: '1rem',
});

export const cardTitle = style({
  fontWeight: 'bold',
  marginBottom: '0.25rem',
});

export const cardText = style({
  fontSize: '0.9rem',
  marginBottom: '0.5rem',
  color: '#555',
});

export const cardFooter = style({
  padding: '1rem',
  paddingTop: '0',
});
