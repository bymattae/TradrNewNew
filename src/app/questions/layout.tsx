import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Tradr Profile',
  description: 'Answer a few questions to set up your trading profile'
};

export default function QuestionsLayout({
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