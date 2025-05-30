/// <reference types="astro/client" />
/// <reference types="@astrojs/preact" />

declare namespace preact.JSX {
  interface IntrinsicElements {
    // Shoelace components example
    'sl-button': preact.JSX.HTMLAttributes<HTMLElement> & {
      variant?: 'default' | 'primary' | 'success' | 'neutral' | 'warning' | 'danger';
      size?: 'small' | 'medium' | 'large';
      loading?: boolean;
      // Add other specific props your component accepts
    };
    
    'sl-card': preact.JSX.HTMLAttributes<HTMLElement>;
    // Add other custom elements as needed
  }
}