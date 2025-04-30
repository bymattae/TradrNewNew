interface CTABlockProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

export default function CTABlock({
  title,
  description,
  buttonText,
  onClick
}: CTABlockProps) {
  return (
    <div className="w-full rounded-2xl bg-[#141414] p-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
        <button
          onClick={onClick}
          className="w-full rounded-xl bg-[#7C3AED] py-3 text-white transition-colors hover:bg-[#6D28D9] active:bg-[#5B21B6]"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
} 