// Design System for Tradr App
// This file documents our current styling patterns and components

export const colors = {
  primary: {
    main: 'bg-indigo-600',
    hover: 'hover:bg-indigo-500',
    text: 'text-indigo-400',
    hoverText: 'hover:text-indigo-300',
    border: 'border-indigo-500/50',
    hoverBorder: 'hover:border-indigo-500/50',
  },
  background: {
    main: 'bg-black',
    card: 'bg-zinc-900/50',
    lightCard: 'bg-zinc-900/30',
  },
  text: {
    primary: 'text-white',
    secondary: 'text-gray-400',
    tertiary: 'text-gray-500',
  },
  success: {
    text: 'text-emerald-500',
  },
};

export const spacing = {
  container: {
    padding: 'px-4 py-6',
    maxWidth: 'max-w-2xl',
  },
  section: {
    gap: 'space-y-6',
  },
  input: {
    padding: 'px-4 py-3',
  },
};

export const typography = {
  heading: {
    large: 'text-2xl font-bold',
    medium: 'text-xl font-bold',
    small: 'text-base font-medium',
  },
  body: {
    large: 'text-base',
    medium: 'text-sm',
    small: 'text-xs',
  },
};

export const components = {
  // Input Fields
  input: {
    base: 'bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-indigo-500/50 backdrop-blur-xl',
    disabled: 'opacity-50 cursor-not-allowed',
  },

  // Buttons
  button: {
    primary: 'bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-all',
    secondary: 'text-gray-400 hover:text-white transition-colors',
    icon: 'text-gray-400 hover:text-white transition-colors',
  },

  // Cards
  card: {
    base: 'bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3 backdrop-blur-xl',
    hover: 'hover:border-indigo-500/50 transition-all',
  },

  // Modals
  modal: {
    container: 'fixed inset-0 bg-black z-50 flex flex-col h-[100dvh]',
    header: 'flex items-center justify-between p-4 border-b border-zinc-800/50',
    content: 'flex-1 px-4 py-6 flex flex-col',
  },

  // Navigation
  nav: {
    header: 'p-4 border-b border-zinc-800/50 flex items-center justify-between',
    footer: 'sticky bottom-0 left-0 right-0 p-4 border-t border-zinc-800/50 bg-black/80 backdrop-blur-xl',
  },

  // Progress
  progress: {
    container: 'fixed top-0 left-0 right-0 h-0.5 bg-zinc-800',
    bar: 'h-full bg-indigo-500 transition-all duration-300',
  },
};

export const layout = {
  container: 'h-[100dvh] bg-black text-white flex flex-col',
  content: 'flex-1 flex flex-col max-h-[calc(100dvh-64px)] overflow-hidden',
  scrollable: 'flex-1 overflow-y-auto scrollbar-hide',
  centered: 'max-w-2xl mx-auto w-full',
};

export const animations = {
  checkmark: {
    keyframes: `
      @keyframes checkmark {
        0% {
          transform: scale(0.5);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `,
    class: 'animate-[checkmark_0.2s_ease-in-out_both]',
  },
};

// Common component patterns
export const patterns = {
  // Section header with divider
  sectionHeader: (title: string, color: 'primary' | 'secondary' = 'primary') => `
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm font-medium ${color === 'primary' ? 'text-indigo-400' : 'text-gray-400'}">${title}</span>
      <div className="h-px flex-1 bg-zinc-800/50"></div>
    </div>
  `,

  // Input field with label and edit button
  inputField: (label: string, value: string, placeholder: string, onEdit: () => void) => `
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">${label}</label>
        <button
          onClick={${onEdit}}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Edit
        </button>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3">
        <p className="text-gray-400">
          ${value || placeholder}
        </p>
      </div>
    </div>
  `,

  // Optional action button
  actionButton: (title: string, description: string, onClick: () => void) => `
    <button 
      onClick={${onClick}}
      className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-6 text-left hover:border-indigo-500/50 transition-all group backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-white group-hover:text-indigo-400 transition-colors text-base font-medium">${title}</span>
          <p className="text-sm text-gray-400">${description}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      </div>
    </button>
  `,
}; 