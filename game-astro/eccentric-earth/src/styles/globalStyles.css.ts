import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

// Global element styles
globalStyle('body', {
  margin: 0,
  fontFamily: vars.font.base,
  background: vars.color.background,
  color: vars.color.text,
});

globalStyle('header', {
  background: vars.color.background,
  color: vars.color.primary,
  padding: '1rem',
});

globalStyle('header nav a', {
  color: vars.color.primary,
  marginRight: '1rem',
  textDecoration: 'none',
});

globalStyle('header nav a:hover', {
  textDecoration: 'underline',
});

globalStyle('main', {
  maxWidth: '800px',
  margin: '2rem auto',
  padding: '1rem',
  background: vars.color.background,
  borderRadius: vars.radius.sm,
  boxShadow: vars.shadow.md,
  border: 'none',
});

globalStyle('@media screen and (max-width: 800px)', {
  'main': {
    maxWidth: '100%',
  }
});

globalStyle('footer', {
  padding: '1rem',
  textAlign: 'center',
  borderTop: `1px solid ${vars.color.primary}`,
  position: 'sticky',
  bottom: '0',
});

globalStyle('.ad', {
  background: vars.color.background,
  padding: '1rem',
  textAlign: 'center',
  minHeight: '200px',
});
