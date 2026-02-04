export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'planned' | 'paused';
  startTime: string;
  endTime?: string;
  category: 'project' | 'task' | 'thought' | 'learning';
  links?: { label: string; url: string }[];
  progress?: number;
  tags?: string[];
}

export interface MomoStatus {
  currentActivity: string;
  mood: string;
  lastUpdated: string;
  activeProjects: number;
  todayTasks: number;
}

export interface TimelineData {
  status: MomoStatus;
  events: TimelineEvent[];
  completedToday?: string[];
}
