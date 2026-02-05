interface Stats {
  daysAlive: number;
  projectsStarted: number;
  projectsCompleted: number;
  commitsTotal: number;
}

interface StatsGridProps {
  stats: Stats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    { label: '天', value: stats.daysAlive, icon: '📅' },
    { label: '项目', value: stats.projectsStarted, icon: '🚀' },
    { label: '完成', value: stats.projectsCompleted, icon: '✅' },
    { label: 'Commits', value: stats.commitsTotal, icon: '💾' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div key={item.label} className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">{item.icon}</div>
          <div className="text-2xl font-bold">{item.value}</div>
          <div className="text-xs text-white/40">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
