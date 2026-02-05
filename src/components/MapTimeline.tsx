'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

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

interface MapTimelineProps {
  events: Event[];
}

// 生成蜿蜒的路径点
function generatePath(count: number) {
  const points: { x: number; y: number }[] = [];
  const width = 800;
  const height = count * 100;
  
  for (let i = 0; i < count; i++) {
    // 蛇形路径：奇数行靠右，偶数行靠左
    const x = i % 2 === 0 ? 150 : width - 150;
    const y = 80 + i * 120;
    points.push({ x, y });
  }
  return points;
}

// 获取事件当前状态
function getEventStatus(segments: Segment[]): 'active' | 'paused' | 'completed' | 'future' {
  const last = segments[segments.length - 1];
  if (!last.end && last.status === 'active') return 'active';
  if (!last.end && last.status === 'paused') return 'paused';
  if (last.status === 'completed') return 'completed';
  return 'completed';
}

// 生成曲线路径
function createCurvePath(points: { x: number; y: number }[]) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export function MapTimeline({ events }: MapTimelineProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // 按开始时间排序
  const sorted = [...events].sort((a, b) => 
    new Date(a.segments[0].start).getTime() - new Date(b.segments[0].start).getTime()
  );
  
  const points = generatePath(sorted.length);
  const pathD = createCurvePath(points);
  const svgHeight = sorted.length * 120 + 100;

  return (
    <div className="relative bg-gradient-to-b from-slate-900/50 to-slate-950/50 rounded-2xl p-6 border border-white/5 overflow-hidden">
      {/* 背景星星 */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      <svg width="100%" height={svgHeight} className="relative z-10">
        {/* 路径底层（暗色） */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* 发光路径（渐变） */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* 地点节点 */}
        {sorted.map((event, i) => {
          const point = points[i];
          const status = getEventStatus(event.segments);
          const isHovered = hoveredId === event.id;
          const isActive = status === 'active';
          
          return (
            <g key={event.id}>
              {/* 发光效果 */}
              {(isActive || isHovered) && (
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 35 : 25}
                  fill={isActive ? "rgba(139, 92, 246, 0.3)" : "rgba(255,255,255,0.1)"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* 节点主体 */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={isHovered ? 22 : 18}
                fill={status === 'completed' ? '#10b981' : status === 'active' ? '#8b5cf6' : '#f59e0b'}
                stroke="white"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredId(event.id)}
                onMouseLeave={() => setHoveredId(null)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring' }}
              />

              {/* Emoji */}
              <text
                x={point.x}
                y={point.y + 5}
                textAnchor="middle"
                fontSize="14"
                style={{ pointerEvents: 'none' }}
              >
                {event.emoji}
              </text>

              {/* 标签 */}
              <motion.g
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                <text
                  x={i % 2 === 0 ? point.x + 35 : point.x - 35}
                  y={point.y - 8}
                  textAnchor={i % 2 === 0 ? 'start' : 'end'}
                  fill="white"
                  fontSize="13"
                  fontWeight="500"
                >
                  {event.title}
                </text>
                <text
                  x={i % 2 === 0 ? point.x + 35 : point.x - 35}
                  y={point.y + 10}
                  textAnchor={i % 2 === 0 ? 'start' : 'end'}
                  fill="rgba(255,255,255,0.4)"
                  fontSize="10"
                >
                  {status === 'active' ? '🔥 进行中' : status === 'paused' ? '⏸️ 暂停' : '✅ 完成'}
                </text>
              </motion.g>
            </g>
          );
        })}
      </svg>

      {/* 图例 */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-white/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-500" />
          <span>进行中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span>暂停</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>完成</span>
        </div>
      </div>
    </div>
  );
}