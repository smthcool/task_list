import React, { useMemo, useState } from 'react';
import { List, Checkbox, Button, Tag, Typography, Modal, Space, message } from 'antd';
import { Task, TaskPriority } from '../types/types';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;
const { confirm } = Modal;

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string) => void;  // ИСПРАВЛЕНО: теперь принимает только id
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
            <Button 
              key="edit" 
              onClick={() => onEditTask(task.id)}  // ИСПРАВЛЕНО: вызываем onEditTask с id
            >
              Редактировать
            </Button>,
            <Button 
              key="delete" 
              danger 
              onClick={() => showDeleteConfirm(task)}
            >
              Удалить
            </Button>
          ]}
        >
          <Checkbox 
            checked={task.completed} 
            onChange={() => onToggleTask(task.id)}
          />
          <div style={{ marginLeft: 8, flex: 1 }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space>
                <Text delete={task.completed} strong>
                  {task.title}
                </Text>
                {task.priority && (
                  <Tag color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'}>
                    {priorityColors[task.priority]}
                  </Tag>
                )}
              </Space>
              {task.description && (
                <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
                  {task.description}
                </Paragraph>
              )}
              <Space size={[0, 8]} wrap>
                {task.tags && task.tags.map(tag => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
                {task.estimatedMinutes && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    ⏱ {task.estimatedMinutes} мин
                  </Text>
                )}
              </Space>
            </Space>
          </div>
        </List.Item>
      )}
    />
  );
};