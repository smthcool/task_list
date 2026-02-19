import React, { useState, useMemo } from 'react';
import { List, Checkbox, Button, Tag, Typography, Modal, Descriptions, Form, Input, Select, DatePicker, Space, message } from 'antd';
import { Task, TaskPriority } from '../types';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Paragraph, Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, updatedTask: Partial<Task>) => void; // Изменен тип для редактирования
  sortBy?: 'date' | 'priority';
  filterTag?: string;
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий'
};

const priorityOptions = [
  { value: 'low', label: 'Низкий', color: 'green' },
  { value: 'medium', label: 'Средний', color: 'orange' },
  { value: 'high', label: 'Высокий', color: 'red' },
];

const defaultTags = ['работа', 'дом', 'учеба', 'спорт'];

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  sortBy = 'date',
  filterTag
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editForm] = Form.useForm();
  const [editModalVisible, setEditModalVisible] = useState(false);
  
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

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    editForm.setFieldsValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      estimatedMinutes: task.estimatedMinutes,
      tags: task.tags
    });

    setEditModalVisible(true);
  };

  const handleEditSave = async () => {
    try {
      const values = await editForm.validateFields();
      if (selectedTask) {
        onEditTask(selectedTask.id, values);
        setEditModalVisible(false);
        message.success('Задача успешно обновлена');
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
    setSelectedTask(null);
    editForm.resetFields();
  };

  return (
    <>
      <List
        dataSource={processedTasks}
        renderItem={(task) => (
          <List.Item
            key={task.id}
            actions={[
              <Button key="edit" onClick={() => openEditModal(task)}>
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

      <Modal
        title="Редактировать задачу"
        open={editModalVisible}
        onOk={handleEditSave}
        onCancel={handleEditCancel}
        okText="Сохранить"
        cancelText="Отмена"
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Название задачи"
            rules={[{ required: true, message: 'Пожалуйста, введите название задачи' }]}
          >
            <Input placeholder="Введите название задачи" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
          >
            <TextArea 
              placeholder="Введите описание задачи" 
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Приоритет"
            initialValue="medium"
          >
            <Select>
              {priorityOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <Text style={{ color: option.color }}>{option.label}</Text>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="estimatedMinutes"
            label="Примерное время (минуты)"
          >
            <Input 
              type="number" 
              min={1} 
              placeholder="Введите время в минутах"
            />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Теги"
          >
            <Select
              mode="multiple"
              placeholder="Выберите теги"
              options={defaultTags.map(tag => ({ label: tag, value: tag }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};