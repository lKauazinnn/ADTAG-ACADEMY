export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  videos: Video[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  order: number;
  completed?: boolean;
  watchedTime?: number;
  canWatch?: boolean;
}

export interface Progress {
  overallProgress: number;
  totalVideos: number;
  totalCompleted: number;
  modules: ModuleProgress[];
}

export interface ModuleProgress {
  moduleId: string;
  moduleTitle: string;
  totalVideos: number;
  completedVideos: number;
  progressPercentage: number;
}
