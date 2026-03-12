import React, {useEffect, useState} from 'react';
import { TaskPriority, TimeRemaining} from '../types/types';
import { Button, Card, DatePicker, Form, Input, message, Select, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.locale('ru');

const {Option} = Select;
const {TextArea} = Input;
const {Title, Text} = Typography;
const {RangePicker} = DatePicker;

interface TaskFormProps {
    onAddTask: (task: {
        title: string;
        description: string;
        completed: boolean;
        priority: TaskPriority;
        deadline?: Date;
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
  const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(dayjs().add(1, 'day').hour(1).minute(59).second(59));
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);

   useEffect(() => {
    if (!deadline) {
      setTimeRemaining(null);
      return;
    }
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const calculateTimeRemaining = () => {

    if (!deadline) {
      setTimeRemaining(null);
      return;
    }

    const now = dayjs();
    const diffSeconds = deadline.diff(now, 'second');
    if (diffSeconds <= 0) {
      setTimeRemaining({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalHours: 0,
        isOverdue: true
      });
      return;
    }
    
    const duration = dayjs.duration(diffSeconds, 'seconds');
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    const totalHours = Math.round(duration.asHours() * 10) / 10;

    setTimeRemaining({
      days,
      hours,
      minutes,
      seconds,
      totalHours,
      isOverdue: false
    });
  }


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

        <Form.Item 
          label="Срок выполнения"
          extra="Выберите дату и время, к которому нужно выполнить задачу"
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <DatePicker 
              showTime={{
                format: 'HH:mm',
                defaultValue: dayjs('23:59', 'HH:mm')
              }}
              format="DD.MM.YYYY HH:mm"
              value={deadline}
              onChange={(date) => setDeadline(date)}
              style={{ width: '100%' }}
              size="large"
              placeholder="Выберите дату и время"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
            
          </Space>
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