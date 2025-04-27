import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Tradr',
  description: 'Your personal trading profile',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 