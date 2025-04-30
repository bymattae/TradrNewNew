import { Grid } from 'lucide-react';

interface HubButtonProps {
  onClick: () => void;
}

export default function HubButton({ onClick }: HubButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#7C3AED] shadow-lg shadow-[#7C3AED]/20 transition-transform hover:scale-105 active:scale-95"
    >
      <Grid className="h-6 w-6 text-white" />
    </button>
  );
} 