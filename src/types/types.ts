export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatus = 'todo' | 'in progress' | 'done';

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: TaskPriority;
    createAt: Date;
    completedAt?: Date;
    estimatedMinutes?: number;
    deadline?: Date;
    tags: string[];
}

export interface Analytics {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    averageCompletionTimm: number;
    tasksByPriority: {
        low: number;
        medium: number;
        high: number;
    };
}

export interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalHours: number;
    isOverdue: boolean;
}