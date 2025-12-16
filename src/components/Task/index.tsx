import { useTodos } from '@/hooks/task';
import { useMemo, useRef, useState } from 'react';
import Card from '../Card';
import TaskHeader from './TaskHeader';
import TaskContent from './TaskContent';
import NewTaskModal from './NewTaskModal';
import { handleSaveNewTask } from '@/utils';
import LoadingState from '../Loading';

export default function Task() {
  const isSavingRef = useRef(false);

  const { todosQuery, updateTodo, deleteTodo, createTodo } = useTodos();

  const isInitialLoading = todosQuery.isLoading && !todosQuery.data;

  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeTask, setActiveTask] = useState<'task1' | 'task2'>('task1');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [localTasks, setLocalTasks] = useState<any[]>([]);
  const [newTaskDate, setNewTaskDate] = useState('11/06/2021');

  const apiTodos = todosQuery.data ?? [];
  const todos = [
    ...localTasks,
    ...apiTodos.filter((api: any) => !localTasks.some((l) => l.id === api.id)),
  ];
  const openTasks = todos.filter((t: any) => !t.completed).slice(0, 10);

  const mergedTodos = Array.from(new Map([...localTasks, ...todos].map((t) => [t.id, t])).values());

  const filteredOpenTasks = useMemo(() => {
    const filtered =
      activeTask === 'task1'
        ? mergedTodos.filter((t: any) => Number(t.id) % 2 === 1 || t.id.includes('local-'))
        : mergedTodos.filter((t: any) => Number(t.id) % 2 === 0 || t.id.includes('local-'));

    return filtered.slice(0, 10);
  }, [openTasks, activeTask]);

  return (
    <div className="mr-5">
      <Card>
        {isInitialLoading ? (
          <LoadingState text="Loading Task List..." />
        ) : (
          <div className="h-184.25 overflow-auto">
            <TaskHeader
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              activeTask={activeTask}
              setActiveTask={setActiveTask}
              onNewTask={() => setShowNewTask(true)}
            />

            <TaskContent
              showNewTask={showNewTask}
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
              newTaskDescription={newTaskDescription}
              setNewTaskDescription={setNewTaskDescription}
              onOpenModal={() => setShowNewTaskModal(true)}
              filteredOpenTasks={filteredOpenTasks}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
              setLocalTasks={setLocalTasks}
              newTaskDate={newTaskDate}
              setNewTaskDate={setNewTaskDate}
            />

            <NewTaskModal
              open={showNewTaskModal}
              onClose={() => {
                setShowNewTaskModal(false);
                setShowNewTask(false);
              }}
              onSave={() =>
                handleSaveNewTask({
                  title: newTaskTitle,
                  date: newTaskDate,
                  description: newTaskDescription,
                  setLocalTasks,
                  createTodo,
                  isSavingRef,
                  resetForm: () => {
                    setShowNewTask(false);
                    setShowNewTaskModal(false);
                    setNewTaskTitle('');
                    setNewTaskDescription('');
                  },
                })
              }
            />
          </div>
        )}
      </Card>
    </div>
  );
}
