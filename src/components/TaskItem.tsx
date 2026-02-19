import React from 'react';
import {Task, TaskPriority} from '../types';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}
const priorityColors: Record<TaskPriority, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
};

export const TaskItem: React.FC<TaskItemProps> = ({task, onToggle, onDelete}) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('ru-RU')
    }
    return (
    <div className={'task-item p-4 border rounded-lg mb-2'}>
        {task.title}
    </div>
)
}
