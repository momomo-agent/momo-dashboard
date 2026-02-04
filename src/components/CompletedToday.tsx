'use client';

interface CompletedTodayProps {
  items: string[];
}

export function CompletedToday({ items }: CompletedTodayProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-sm text-white/70">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
