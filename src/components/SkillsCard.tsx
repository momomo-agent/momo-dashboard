interface Learning {
  id: string;
  skill: string;
  level: string;
  note: string;
}

interface SkillsCardProps {
  learnings: Learning[];
}

export function SkillsCard({ learnings }: SkillsCardProps) {
  const levelColor = (level: string) => {
    switch (level) {
      case '熟练': return 'bg-green-500/20 text-green-400';
      case '入门': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-white/10 text-white/60';
    }
  };

  return (
    <div className="space-y-3">
      {learnings.map((item) => (
        <div key={item.id} className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">{item.skill}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${levelColor(item.level)}`}>
              {item.level}
            </span>
          </div>
          <p className="text-xs text-white/40">{item.note}</p>
        </div>
      ))}
    </div>
  );
}
