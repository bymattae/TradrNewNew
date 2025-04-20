import "./globals.css";
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { AuthProvider } from './lib/contexts/AuthContext';
import { Space_Grotesk, Outfit } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Tradr - Your Trading Journey',
  description: 'Connect with traders, share your journey, and grow together.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${outfit.variable} h-full`}>
      <body className="h-full">
        <AuthProvider>
          {children}
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
