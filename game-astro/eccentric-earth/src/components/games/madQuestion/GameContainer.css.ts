import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/theme.css';



export const buttonPrimary = style({
  backgroundColor: vars.color.primary,
  color: 'white',
  fontWeight: 600,
  padding: `${vars.space.sm} ${vars.space.lg}`,
  fontSize: '1rem',
  borderRadius: vars.radius.md,
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  ':hover': {
    backgroundColor: vars.color.primaryHover,
  },
});
