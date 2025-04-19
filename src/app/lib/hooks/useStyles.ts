import { colors, spacing, layout, components, cn } from '../styles/design-system';

export const useStyles = () => {
  return {
    colors,
    spacing,
    layout,
    components,
    cn,
    
    // Common component styles
    getInputStyles: (hasError?: boolean) => {
      const classes = [
        components.input.base,
        components.input.focus,
      ];
      
      if (hasError) {
        classes.push(components.input.error);
      }
      
      return cn(...classes);
    },

    getButtonStyles: (variant: 'primary' | 'secondary' | 'icon' = 'primary') =>
      components.button[variant],

    getCardStyles: (isHoverable?: boolean) => {
      const classes = [
        components.card.base,
        components.card.padding,
      ];
      
      if (isHoverable) {
        classes.push(components.card.hover);
      }
      
      return cn(...classes);
    },

    getIconContainerStyles: (size: 'sm' | 'md' | 'lg' = 'md') =>
      cn(
        components.icon.container.base,
        components.icon.container.sizes[size]
      ),

    getIconStyles: (size: 'sm' | 'md' | 'lg' = 'md') =>
      components.icon.sizes[size],

    getErrorStyles: () => ({
      container: components.error.container,
      text: components.error.text,
      icon: components.error.icon,
    }),

    getSuccessStyles: () => ({
      container: components.success.container,
      text: components.success.text,
      icon: components.success.icon,
    }),

    getInfoStyles: () => ({
      container: components.info.container,
      text: components.info.text,
      icon: components.info.icon,
    }),
  };
};

// Example usage:
// import { useStyles } from '@/lib/hooks/useStyles';
//
// function MyComponent() {
//   const styles = useStyles();
//
//   return (
//     <div className={styles.getCardStyles()}>
//       <input className={styles.getInputStyles(hasError)} />
//       <button className={styles.getButtonStyles('primary')}>
//         Click me
//       </button>
//     </div>
//   );
// } 