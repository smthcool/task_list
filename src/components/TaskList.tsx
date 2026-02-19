import React, { useState, useMemo } from 'react';
import { List, Checkbox, Button, Tag, Typography, Modal } from 'antd'; // Добавлен импорт Modal
import { Task, TaskPriority } from '../types';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Paragraph, Title } = Typography;
const { confirm } = Modal; // Деструктуризация confirm из Modal

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string) => void;
  sortBy?: 'date' | 'priority';
  filterTag?: string;
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий'
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  sortBy = 'date',
  filterTag
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const processedTasks = useMemo(() => {
    let filtered = filterTag ? tasks.filter(task => task.tags?.includes(filterTag)) : [...tasks];
    
    switch (sortBy) {
      case 'priority':
        filtered.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        break;
      case 'date':
      default:
        filtered.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()); 
    }
    
    return filtered;
  }, [tasks, sortBy, filterTag]);

  const showDeleteConfirm = (task: Task) => {
    confirm({
      title: 'Удалить задачу?',
      icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
      content: (
        <div>
          <p>Вы точно хотите удалить задачу?</p>
          <Text strong>{task.title}</Text>
        </div>
      ),
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk() {
        onDeleteTask(task.id);
      }
    });
  };

  return (
    <List
      dataSource={processedTasks}
      renderItem={(task) => (
        <List.Item
          key={task.id}
          actions={[
            <Button key="edit" onClick={() => onEditTask(task.id)}>
              Редактировать
            </Button>,
            <Button 
              key="delete" 
              danger 
              onClick={() => showDeleteConfirm(task)} // Используем showDeleteConfirm
            >
              Удалить
            </Button>
          ]}
        >
          <Checkbox 
            checked={task.completed} 
            onChange={() => onToggleTask(task.id)}
          />
          <div style={{ marginLeft: 8 }}>
            <Text delete={task.completed}>
              {task.title}
            </Text>
            {task.priority && (
              <Tag color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'}>
                {priorityColors[task.priority]}
              </Tag>
            )}
            {task.tags && task.tags.map(tag => (
              <Tag key={tag} color="blue">{tag}</Tag> // Добавлено отображение тегов
            ))}
          </div>
        </List.Item>
      )}
    />
  );
};