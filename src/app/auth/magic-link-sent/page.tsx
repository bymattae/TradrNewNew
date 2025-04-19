'use client';

import { useRouter } from 'next/navigation';
import { useStyles } from '@/app/lib/hooks/useStyles';
import { cn } from '@/app/lib/styles/design-system';

export default function MagicLinkSent() {
  const router = useRouter();
  const styles = useStyles();

  return (
    <div className={cn(
      styles.colors.background.primary,
      styles.layout.flex.center,
      'min-h-screen',
      styles.spacing.container.page
    )}>
      <div className={cn(
        styles.layout.maxWidth.form,
        'w-full',
        styles.spacing.stack.loose
      )}>
        <div className={styles.spacing.stack.normal}>
          <div className={styles.getIconContainerStyles('lg')}>
            <svg
              className={cn(
                styles.getIconStyles('lg'),
                styles.colors.text.accent
              )}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 5L10 3M10 3L12 5M10 3L8 1M10 3L12 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M19 14L21 12M21 12L23 14M21 12L19 10M21 12L23 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M3 14L4 13M4 13L5 14M4 13L3 12M4 13L5 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M17.5 6.5L4.5 19.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                className="animate-pulse"
                d="M17.5 6.5L19 5L19.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className={styles.spacing.stack.tight}>
            <h2 className={styles.components.text.h2}>
              Check your e-mail
            </h2>
            <p className={styles.components.text.body}>
              We&apos;ve sent you a magic link!
            </p>
          </div>
        </div>

        <div className={styles.getInfoStyles().container}>
          <div className={cn(styles.layout.flex.row, styles.spacing.inline.normal)}>
            <svg 
              className={styles.getInfoStyles().icon} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                clipRule="evenodd" 
              />
            </svg>
            <p className={styles.getInfoStyles().text}>
              Make sure to check your spam folder if you don&apos;t see the email.
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push('/auth/join')}
          className={styles.getButtonStyles('secondary')}
        >
          Return to sign in
        </button>
      </div>
    </div>
  );
} 