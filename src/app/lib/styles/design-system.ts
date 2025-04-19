// Design system constants and utility classes for consistent styling across the app

export const colors = {
  // Background colors
  background: {
    primary: 'bg-[#0A0A0C]',
    card: 'bg-white/5',
    cardHover: 'hover:bg-white/10',
    accent: 'bg-violet-500/10',
  },

  // Border colors
  border: {
    default: 'border-white/10',
    accent: 'border-violet-500/20',
  },

  // Text colors
  text: {
    primary: 'text-white',
    secondary: 'text-gray-400',
    accent: 'text-violet-500',
    error: 'text-red-500',
  }
};

export const spacing = {
  container: {
    page: 'px-6 py-12',
    section: 'space-y-6',
    content: 'space-y-4',
  },
  
  stack: {
    tight: 'space-y-1',
    normal: 'space-y-4',
    loose: 'space-y-6',
  },

  inline: {
    tight: 'space-x-2',
    normal: 'space-x-3',
    loose: 'space-x-4',
  }
};

export const layout = {
  maxWidth: {
    form: 'max-w-sm',
    content: 'max-w-2xl',
    page: 'max-w-7xl',
  },

  flex: {
    center: 'flex items-center justify-center',
    column: 'flex flex-col',
    row: 'flex flex-row',
  }
};

export const components = {
  // Button variants
  button: {
    primary: 'w-full rounded-2xl bg-violet-600 px-4 py-3.5 text-sm font-medium text-white hover:bg-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-colors',
    icon: 'rounded-2xl border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition-colors',
  },

  // Input fields
  input: {
    base: 'block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-400',
    focus: 'focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 focus:outline-none',
    error: 'border-red-500/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10',
  },

  // Cards and containers
  card: {
    base: 'rounded-2xl border border-white/10 bg-white/5',
    hover: 'hover:bg-white/10 transition-colors',
    padding: 'p-4',
  },

  // Error messages
  error: {
    container: 'rounded-2xl border border-red-500/20 bg-red-500/10 p-4',
    text: 'text-sm text-red-400',
    icon: 'h-5 w-5 text-red-400',
  },

  // Success messages
  success: {
    container: 'rounded-2xl border border-green-500/20 bg-green-500/10 p-4',
    text: 'text-sm text-green-400',
    icon: 'h-5 w-5 text-green-400',
  },

  // Info messages
  info: {
    container: 'rounded-2xl border border-white/10 bg-white/5 p-4',
    text: 'text-sm text-gray-400',
    icon: 'h-5 w-5 text-violet-400',
  },

  // Icons
  icon: {
    container: {
      base: 'relative rounded-2xl overflow-hidden bg-violet-500/10 border border-violet-500/20 flex items-center justify-center',
      sizes: {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
      }
    },
    sizes: {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    }
  },

  // Typography
  text: {
    h1: 'text-3xl font-semibold text-white',
    h2: 'text-2xl font-semibold text-white',
    h3: 'text-xl font-semibold text-white',
    body: 'text-sm text-gray-400',
    small: 'text-xs text-gray-400',
  }
};

// Helper function to combine multiple classes
export const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

// Example usage:
// import { components, cn } from '@/lib/styles/design-system';
//
// Button example:
// <button className={components.button.primary}>Click me</button>
//
// Input with error example:
// <input className={cn(
//   components.input.base,
//   components.input.focus,
//   hasError && components.input.error
// )} />
//
// Card example:
// <div className={cn(
//   components.card.base,
//   components.card.padding,
//   components.card.hover
// )}>
//   Content
// </div> 