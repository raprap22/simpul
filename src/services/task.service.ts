import { formatDate } from '@/utils';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const todosService = {
  async getTodos() {
    const { data } = await api.get('/todos');

    return data.todos.map((t: any) => ({
      id: String(t.id),
      title: t.todo,
      completed: t.completed,
      userId: t.userId,
      date: formatDate(new Date()),
    }));
  },

  async createTodo(payload: { title: string }) {
    const { data } = await api.post('/todos/add', {
      todo: payload.title,
      completed: false,
      userId: 1,
    });

    return {
      id: String(data.id),
      title: data.todo,
      completed: data.completed,
      userId: data.userId,
      date: '11/06/2021',
    };
  },

  async updateTodo(todoId: string, payload: Partial<{ title: string; completed: boolean }>) {
    const { data } = await api.put(`/todos/${todoId}`, {
      todo: payload.title,
      completed: payload.completed,
    });

    return {
      id: String(data.id),
      title: data.todo,
      completed: data.completed,
    };
  },

  async deleteTodo(todoId: string) {
    const { data } = await api.delete(`/todos/${todoId}`);
    return data;
  },
};
