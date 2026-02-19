import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { TaskItem } from './components/TaskItem';
import { SortOption, Task, TaskPriority } from './types';
import { v4 as uuidv4 } from 'uuid';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Card, Space, Select, Button } from 'antd';

const { Option } = Select;

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: uuidv4(),
      title: 'Изучить Typescript',
      description: 'Пройти курс',
      completed: true,
      priority: 'high',
      createAt: new Date('2024-01-01'),
      completedAt: new Date('2026-01-01'),
      tags: ['учеба', 'разработка']
    }
  ]);
const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [filterTag, setFilterTag] = useState<string>('');

  const availableTags = Array.from(new Set(tasks.flatMap(task => task.tags)));

  const handleAddTask = (task: {
    title: string;
    description: string;
    completed: boolean;
    priority: TaskPriority;
    estimatedMinutes?: number;
    tags: string[];
  }) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createAt: new Date(), // Исправлено: createAt -> createdAt
      completed: false // Добавлено: по умолчанию false для новой задачи
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined
          } 
        : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEditTask = (id: string) => {
    // Находим задачу для редактирования
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      // Здесь можно открыть модальное окно или форму для редактирования
      console.log('Edit task:', taskToEdit);
    }
  };

  const handleSortChange = (value: 'date' | 'priority') => {
  setSortBy(value);
};


  const handleFilterChange = (value: string) => {
    setFilterTag(value);
  };

  const clearFilter = () => {
    setFilterTag('');
  };

  return (
    <Card title="Список задач">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Добавлены элементы управления сортировкой и фильтрацией */}
        <Space>
          <Select 
            value={sortBy} 
            onChange={handleSortChange} 
            style={{ width: 120 }}
          >
            <Option value="date">По дате</Option>
            <Option value="priority">По приоритету</Option>
          </Select>
          
          <Select 
            value={filterTag || 'all'} 
            onChange={handleFilterChange}
            style={{ width: 150 }}
            allowClear
            onClear={clearFilter}
          >
            <Option value="all">Все теги</Option>
            {availableTags.map(tag => (
              <Option key={tag} value={tag}>{tag}</Option>
            ))}
          </Select>
        </Space>

        {/* Форма добавления задачи */}
        <TaskForm onAddTask={handleAddTask} />

        {/* Список задач */}
        <TaskList
          tasks={tasks}
          onToggleTask={handleToggleTask} 
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          sortBy={sortBy}
          filterTag={filterTag === 'all' ? undefined : filterTag}
        />
      </Space>
    </Card>
  );
}

export default App;