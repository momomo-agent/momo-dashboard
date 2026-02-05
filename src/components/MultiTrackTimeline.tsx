'use client';

import { useMemo } from 'react';

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

interface MultiTrackTimelineProps {
  events: Event[];
}

const STATUS_COLORS = {
  active: 'bg-violet-500',
  paused: 'bg-amber-500/60',
  completed: 'bg-emerald-500',
};

const STATUS_BORDERS = {
  active: 'border-violet-400',
  paused: 'border-amber-400',
  completed: 'border-emerald-400',
};

export function MultiTrackTimeline({ events }: MultiTrackTimelineProps) {
  const now = Date.now();
  
  // 计算时间范围
  const { minTime, maxTime, days } = useMemo(() => {
    let min = Infinity, max = -Infinity;
    
    events.forEach(e => e.segments.forEach(s => {
      min = Math.min(min, new Date(s.start).getTime());
      max = Math.max(max, s.end ? new Date(s.end).getTime() : now);
    }));
    
    // 生成日期刻度
    const dayList: Date[] = [];
    const d = new Date(min);
    d.setHours(0, 0, 0, 0);
    while (d.getTime() <= max) {
      dayList.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    
    return { minTime: min, maxTime: max, days: dayList };
  }, [events, now]);

  const duration = maxTime - minTime;
  const toPercent = (t: number) => ((t - minTime) / duration) * 100;
  
  // 按开始时间排序
  const sorted = [...events].sort((a, b) => 
    new Date(a.segments[0].start).getTime() - new Date(b.segments[0].start).getTime()
  );

  return (
    <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5">
      {/* 时间刻度 */}
      <div className="relative h-6 mb-2 ml-36">
        {days.map((day, i) => (
          <div
            key={i}
            className="absolute text-[10px] text-white/30 -translate-x-1/2"
            style={{ left: `${toPercent(day.getTime())}%` }}
          >
            {day.getMonth() + 1}/{day.getDate()}
          </div>
        ))}
      </div>

      {/* 轨道区域 */}
      <div className="relative">
        {/* 垂直网格线 */}
        <div className="absolute inset-0 ml-36 pointer-events-none">
          {days.map((day, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-white/5"
              style={{ left: `${toPercent(day.getTime())}%` }}
            />
          ))}
        </div>

        {/* 每个项目一条轨道 */}
        <div className="space-y-2">
          {sorted.map((event) => (
            <div key={event.id} className="flex items-center gap-3 group">
              {/* 项目标签 */}
              <div className="w-32 flex-shrink-0 flex items-center gap-2 pr-2">
                <span className="text-base">{event.emoji}</span>
                <span className="text-xs text-white/70 truncate">{event.title}</span>
              </div>
              
              {/* 时间轨道 */}
              <div className="flex-1 relative h-7 bg-white/[0.02] rounded-md">
                {event.segments.map((seg, i) => {
                  const start = new Date(seg.start).getTime();
                  const end = seg.end ? new Date(seg.end).getTime() : now;
                  const left = toPercent(start);
                  const width = toPercent(end) - left;
                  const isOngoing = !seg.end;
                  
                  return (
                    <div
                      key={i}
                      className={`absolute top-1 bottom-1 rounded ${STATUS_COLORS[seg.status]} 
                        ${isOngoing ? 'animate-pulse' : ''} 
                        border-l-2 ${STATUS_BORDERS[seg.status]}`}
                      style={{ 
                        left: `${left}%`, 
                        width: `${Math.max(width, 0.8)}%`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-violet-500" />
          <span className="text-xs text-white/40">进行中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500/60" />
          <span className="text-xs text-white/40">暂停</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-xs text-white/40">完成</span>
        </div>
      </div>
    </div>
  );
}