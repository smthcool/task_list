export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: TaskPriority;
    createAt: Date;
    completedAt?: Date;
    estimatedMinutes?: number;
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

export type SortOption = 'date' | 'priority' | 'title';