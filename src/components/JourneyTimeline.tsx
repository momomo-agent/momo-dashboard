'use client';

interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'learning';
}

interface JourneyTimelineProps {
  milestones: Milestone[];
}

export function JourneyTimeline({ milestones }: JourneyTimelineProps) {
  const sorted = [...milestones].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="relative">
      {/* 时间线 */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-fuchsia-500/30 to-transparent" />
      
      <div className="space-y-6">
        {sorted.map((item, index) => (
          <div key={item.id} className="relative pl-12">
            {/* 节点 */}
            <div className={`absolute left-2 w-4 h-4 rounded-full border-2 
              ${item.type === 'milestone' 
                ? 'bg-violet-500 border-violet-400' 
                : 'bg-fuchsia-500 border-fuchsia-400'
              }`} 
            />
            
            {/* 内容 */}
            <div className="bg-white/5 rounded-xl p-4 hover:bg-white/8 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-white/40">{item.date}</span>
              </div>
              <h3 className="font-medium mb-1">{item.title}</h3>
              <p className="text-sm text-white/50">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
