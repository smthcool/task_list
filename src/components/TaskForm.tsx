import React, {useState} from 'react';
import { TaskPriority} from '../types';
import { Button, Card, DatePicker, Form, Input, message, Select, Space, Typography } from 'antd';

interface TaskFormProps {
    onAddTask: (task: {
        title: string;
        description: string;
        completed: boolean;
        priority: TaskPriority;
        estimatedMinutes?: number;
        tags: string[];
    }) => void
}

const priorityOptions: { value:  TaskPriority; label: string; color: string} [] = [
        {value: 'low', label: 'Низкий', color: 'green'},
        {value: 'medium', label: 'Средний', color: 'orange'},
        {value: 'high', label: 'Высокий', color: 'red'},
];


const defaultTags = ['работа', 'дом', 'учеба', 'спорт'];

export const TaskForm: React.FC<TaskFormProps> = ({onAddTask}) => {
  const [form] = Form.useForm();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [tags, setTags] = useState<string[]>(['работа']);

  const handleSubmit = (e: React.FormEvent) => {
    if (!title.trim()) {
        alert('Не заполнено название задачи');
        return;
    }

    onAddTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        completed: false,
        estimatedMinutes: estimatedMinutes > 0 ? estimatedMinutes : undefined,
        tags
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setEstimatedMinutes(30);
    setTags(['работа']);
    message.success('Задача добавлена!');
  }

  const handleTagToggle = (tag: string) => {
    setTags(prevTags => 
      prevTags.includes(tag) 
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  }

  const handleAddCustomTag = () => {
    
  };
   
  const {Option} = Select ;
  const {TextArea} = Input;
  const {RangePicker} = DatePicker;
  const {Text, Title} = Typography;


    return (
    <Card
      title={
        <Space>
          <Title level={4}>Добавить новую задачу</Title>
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Название задачи"
          required
          help={!title.trim() && "Введите название задачи"}
        >
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название задачи"
          />
        </Form.Item>

        <Form.Item label="Описание">
          <TextArea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Введите описание задачи"
            rows={4}
          />
        </Form.Item>

        <Form.Item label="Приоритет">
          <Select 
            value={priority}
            onChange={(value) => setPriority(value as TaskPriority)}
          >
            {priorityOptions.map(option => (
              <Option key={option.value} value={option.value}>
                <Text style={{ color: option.color }}>{option.label}</Text>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Примерное время (минуты)">
          <Input 
            type="number"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
            min={1}
          />
        </Form.Item>

        <Form.Item label="Теги">
          <Space wrap>
            {defaultTags.map(tag => (
              <Button
                key={tag}
                type={tags.includes(tag) ? 'primary' : 'default'}
                onClick={() => handleTagToggle(tag)}
                size="small"
              >
                {tag}
              </Button>
            ))}
          </Space>
        </Form.Item>

        <Form.Item>
          <Button 
          type="primary" htmlType="submit">
            Добавить задачу
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

};