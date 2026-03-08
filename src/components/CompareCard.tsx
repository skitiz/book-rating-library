"use client";

interface CompareCardProps {
  title: string;
  subtitle: string;
  coverUrl: string;
  onClick: () => void;
}

export default function CompareCard({
  title,
  subtitle,
  coverUrl,
  onClick,
}: CompareCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-lg transition-all duration-200 w-full max-w-xs cursor-pointer"
    >
      <div className="w-40 h-56 rounded-lg overflow-hidden shadow-md bg-neutral-100 flex items-center justify-center">
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/160x224/e5e5e5/737373?text=${encodeURIComponent(title)}`;
          }}
        />
      </div>
      <div className="text-center">
        <p className="font-semibold text-neutral-900 text-sm leading-tight">{title}</p>
        <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
      </div>
      <span className="text-xs font-medium text-neutral-400 group-hover:text-neutral-700 transition-colors duration-200">
        Pick this one →
      </span>
    </button>
  );
}
