import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tradr - Share Your Trading Success',
  description: 'Create a beautiful profile to showcase your trading strategies, insights, and metrics'
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 