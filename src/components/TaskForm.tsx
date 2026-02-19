import React, {useState} from 'react';
import { TaskPriority} from '../types';

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

const priorityOptions: { value:  TaskPriority; label: string} [] = [
        {value: 'low', label: 'Низкий'},
        {value: 'medium', label: 'Средний'},
        {value: 'high', label: 'Высокий'},
];


const defaultTags = ['работа', 'дом', 'учеба', 'спорт'];

export const TaskForm: React.FC<TaskFormProps> = ({onAddTask}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [tags, setTags] = useState<string[]>(['работа']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
  }

  const handleTagToggle = (tag: string) => {
    setTags(prevTags => 
      prevTags.includes(tag) 
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-xl font-bold mb-4'>Добавить новую задачу</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Название задачи */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Название задачи *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Что сделать?"
              maxLength={100}
              />
          </div>
          
          {/* Описание */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Описание задачи
            </label> 
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Детали задачи"
              rows={3}
              maxLength={500}
            />
          </div>
          
          {/* Приоритеты и время */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">
              Приоритет
            </label> 
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="estimatedMinutes" className="block text-sm font-medium mb-1">
              Оценочное время (минут)
            </label>
            <input 
              id="estimatedMinutes"
              type="number"
              min="1"
              max="480"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 30)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Теги */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Теги
            </label> 
            <div className="flex flex-wrap gap-2">
              {defaultTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    tags.includes(tag) 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Выбрано: {tags.join(', ')}
            </div>
          </div>

          {/* Кнопка отправки */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Добавить задачу
          </button>
        </form>
        
        {/* Статистика формы */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-100 rounded">
              <p className="font-medium text-gray-700">Символов в названии</p>
              <p className={`text-2xl font-bold ${
                title.length === 0 ? 'text-gray-400' :
                title.length > 50 ? 'text-red-500' :
                'text-green-500'
              }`}>
                {title.length}/100
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-100 rounded">
              <p className="font-medium text-gray-700">Символов в описании</p>
              <p className={`text-2xl font-bold ${
                description.length === 0 ? 'text-gray-400' :
                description.length > 400 ? 'text-red-500' :
                'text-green-500'
              }`}>
                {description.length}/500
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-100 rounded">
              <p className="font-medium text-gray-700">Тегов выбрано</p>
              <p className="text-2xl font-bold text-blue-600">
                {tags.length}
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-100 rounded">
              <p className="font-medium text-gray-700">Время выполнения</p>
              <p className="text-2xl font-bold text-purple-600">
                {estimatedMinutes} мин
              </p>
            </div>
          </div>
        </div>
    </div>
  );
};