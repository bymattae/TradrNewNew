interface StatsBlockProps {
  gain: number;
  winRate: number;
  avgRR: string;
}

export default function StatsBlock({ gain, winRate, avgRR }: StatsBlockProps) {
  return (
    <div className="w-full rounded-2xl bg-[#141414] p-4">
      <div className="grid grid-cols-3 gap-4 rounded-xl bg-black/20 p-4">
        {/* Gain */}
        <div className="text-center">
          <p className="text-lg font-semibold text-[#10B981]">
            {gain > 0 ? '+' : ''}{gain}%
          </p>
          <p className="text-xs text-gray-400">Gain</p>
        </div>

        {/* Win Rate */}
        <div className="text-center">
          <p className="text-lg font-semibold text-white">{winRate}%</p>
          <p className="text-xs text-gray-400">Win Rate</p>
        </div>

        {/* Average RR */}
        <div className="text-center">
          <p className="text-lg font-semibold text-[#7C3AED]">{avgRR}</p>
          <p className="text-xs text-gray-400">Avg RR</p>
        </div>
      </div>
    </div>
  );
} 