import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Tradr',
  description: 'View and manage your trading strategies'
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 