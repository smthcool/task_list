import React, {useEffect} from 'react'
import { Task, TaskPriority } from '../types/types';
import { Form, Input, message, Modal, Select } from 'antd';

const {Option} = Select;
const {TextArea} = Input;

interface EditTaskModalProps {
    task: Task | null;
    visible: boolean;
    onCancel: () => void;
    onSave: (updateTask: Partial<Task>) => void;
}

const priorityOptions: { value:  TaskPriority; label: string; color: string} [] = [
        {value: 'low', label: 'Низкий', color: 'green'},
        {value: 'medium', label: 'Средний', color: 'orange'},
        {value: 'high', label: 'Высокий', color: 'red'},
];

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
    task,
    visible,
    onCancel,
    onSave
}) => {
    const [form] = Form.useForm();

const defaultTags = ['работа', 'дом', 'учеба', 'спорт'];

useEffect(()=> {
    if (task && visible) {
        form.setFieldsValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      estimatedMinutes: task.estimatedMinutes,
      tags: task.tags
        });
    }
}, [task, visible, form]);

const handleSave = async () => {
    try {
        const values = await form.validateFields();
        onSave(values);
        message.success('Задача обновлена успешно!')
    }
    catch (error) {
        message.error('Ошибка при редактировании задачи');
    }
};

return (
    <Modal
     title="Редактировать задачу"
        open={visible}
        onOk={handleSave}
        onCancel={onCancel}
        okText="Сохранить"
        cancelText="Отмена"
        width={600}
        >
        <Form
        form={form}
        layout='vertical'
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
        >
            <Select placeholder="Приоритет">
                {priorityOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                        {option.label}
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
    );
}