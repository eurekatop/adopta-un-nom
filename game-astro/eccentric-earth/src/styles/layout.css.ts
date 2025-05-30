// src/styles/layout.css.ts
import { style, styleVariants } from '@vanilla-extract/css';

export const stackBase = style({
  display: 'flex',
  flexDirection: 'column',
});

export const stackGap = styleVariants({
  none: { gap: '0' },
  sm: { gap: '0.5rem' },
  md: { gap: '1rem' },
  lg: { gap: '2rem' },
});

export const row = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '1rem',
});


// Grid container
export const grid = style({
  display: 'grid',
  gap: '1rem',
});

// Grid column presets (2 to 4 cols, and sidebar layout)
export const gridColumns = styleVariants({
  1: { gridTemplateColumns: '1fr' },
  2: { gridTemplateColumns: '1fr 1fr' },
  3: { gridTemplateColumns: '1fr 1fr 1fr' },
  4: { gridTemplateColumns: '1fr 1fr 1fr 1fr' },
  sidebar: { gridTemplateColumns: '1fr 2fr' },
  reverseSidebar: { gridTemplateColumns: '2fr 1fr' },
});

export const justify = styleVariants({
  start: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
  end: { justifyContent: 'flex-end' },
  between: { justifyContent: 'space-between' },
});

export const align = styleVariants({
  start: { alignItems: 'flex-start' },
  center: { alignItems: 'center', alignSelf: 'center', textAlign: 'center' },
  end: { alignItems: 'flex-end' },
  stretch: { alignItems: 'stretch' },
});