'use client';

interface Segment {
  start: string;
  end: string | null;
  status: 'active' | 'paused' | 'completed';
}

interface Event {
  id: string;
  title: string;
  emoji: string;
  segments: Segment[];
  category: string;
}

interface GanttTimelineProps {
  events: Event[];
}

function getTimeRange(events: Event[]) {
  let minTime = Infinity;
  let maxTime = -Infinity;
  const now = Date.now();
  
  events.forEach(event => {
    event.segments.forEach(seg => {
      const start = new Date(seg.start).getTime();
      const end = seg.end ? new Date(seg.end).getTime() : now;
      minTime = Math.min(minTime, start);
      maxTime = Math.max(maxTime, end);
    });
  });
  
  return { minTime, maxTime, now };
}

function getDayLabels(minTime: number, maxTime: number) {
  const days: { date: Date; label: string }[] = [];
  const start = new Date(minTime);
  start.setHours(0, 0, 0, 0);
  const end = new Date(maxTime);
  
  while (start <= end) {
    days.push({
      date: new Date(start),
      label: `${start.getMonth() + 1}/${start.getDate()}`
    });
    start.setDate(start.getDate() + 1);
  }
  return days;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'bg-violet-500';
    case 'paused': return 'bg-yellow-500/50';
    case 'completed': return 'bg-green-500';
    default: return 'bg-white/20';
  }
}

export function GanttTimeline({ events }: GanttTimelineProps) {
  const { minTime, maxTime, now } = getTimeRange(events);
  const totalDuration = maxTime - minTime;
  const days = getDayLabels(minTime, maxTime);
  
  const sorted = [...events].sort((a, b) => 
    new Date(a.segments[0].start).getTime() - new Date(b.segments[0].start).getTime()
  );

  const getPosition = (time: number) => ((time - minTime) / totalDuration) * 100;

  return (
    <div className="bg-white/5 rounded-xl p-6 overflow-x-auto">
      <div className="relative h-8 mb-4 ml-32">
        {days.map((day, i) => (
          <div
            key={i}
            className="absolute text-xs text-white/40"
            style={{ left: `${getPosition(day.date.getTime())}%` }}
          >
            {day.label}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map((event) => (
          <div key={event.id} className="flex items-center gap-4">
            <div className="w-28 flex-shrink-0 flex items-center gap-2">
              <span>{event.emoji}</span>
              <span className="text-sm truncate">{event.title}</span>
            </div>
            
            <div className="flex-1 relative h-6 bg-white/5 rounded">
              {event.segments.map((seg, i) => {
                const start = new Date(seg.start).getTime();
                const end = seg.end ? new Date(seg.end).getTime() : now;
                const left = getPosition(start);
                const width = getPosition(end) - left;
                
                return (
                  <div
                    key={i}
                    className={`absolute h-full rounded ${getStatusColor(seg.status)} ${!seg.end ? 'animate-pulse' : ''}`}
                    style={{ left: `${left}%`, width: `${Math.max(width, 0.5)}%` }}
                    title={`${seg.status}: ${seg.start} → ${seg.end || '进行中'}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-6 text-xs text-white/50">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-violet-500" />
          <span>进行中</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-500/50" />
          <span>暂停</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>完成</span>
        </div>
      </div>
    </div>
  );
}
