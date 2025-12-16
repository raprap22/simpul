export const USER_COLORS = [
  {
    bg: '#FCEED3',
    accent: '#E5A443',
    text: '#6B4B00',
  },
  {
    bg: '#EEDCFF',
    accent: '#9B51E0',
    text: '#4A2A6A',
  },
  {
    bg: '#D2F2EA',
    accent: '#43B78D',
    text: '#0F4F3B',
  },
];

export function getUserColor(userId: number) {
  return USER_COLORS[userId % USER_COLORS.length];
}

export const getDescription = (id: string, title: string, descriptions: any) => {
  return descriptions[id] ?? `This is a Description of ${title}`;
};

export function handleSaveNewTask({
  title,
  description,
  setLocalTasks,
  createTodo,
  resetForm,
  isSavingRef,
  date,
}: any) {
  if (isSavingRef.current) return;

  if (!title.trim()) return;

  isSavingRef.current = true;

  const newTask = {
    id: `local-${Date.now()}`,
    title,
    description,
    completed: false,
    date: date,
    isLocal: true,
  };

  setLocalTasks((prev: any[]) => [newTask, ...prev]);

  createTodo.mutate({ title });

  resetForm();

  setTimeout(() => {
    isSavingRef.current = false;
  }, 0);
}

export function handleToggleComplete({
  task,
  setLocalTasks,
  updateTodo,
}: {
  task: any;
  setLocalTasks: Function;
  updateTodo: any;
}) {
  const nextCompleted = !task.completed;

  setLocalTasks((prev: any[]) => {
    const exists = prev.find((t) => t.id === task.id);

    if (exists) {
      return prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t));
    }

    return [
      {
        ...task,
        completed: nextCompleted,
        isLocal: true,
      },
      ...prev,
    ];
  });

  if (!task.isLocal) {
    updateTodo.mutate({
      id: task.id,
      completed: nextCompleted,
    });
  }
}

export function handleDeleteTask({
  task,
  setLocalTasks,
  deleteTodo,
}: {
  task: any;
  setLocalTasks: any;
  deleteTodo: any;
}) {
  if (task.isLocal) {
    setLocalTasks((prev: any[]) => prev.filter((t) => t.id !== task.id));
  } else {
    deleteTodo.mutate({ todoId: task.id });
  }
}

export function handleEditDescription({ task, value, setLocalTasks, setDescriptions }: any) {
  if (task.isLocal) {
    setLocalTasks((prev: any[]) =>
      prev.map((t) => (t.id === task.id ? { ...t, description: value } : t))
    );
  } else {
    setDescriptions((prev: any) => ({
      ...prev,
      [task.id]: value,
    }));
  }
}

export function formatDate(date: Date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function parseDMY(dateStr: string) {
  const [d, m, y] = dateStr.split('/').map(Number);
  return new Date(y, m - 1, d);
}

export function handleEditDate({ task, value, setLocalTasks }: any) {
  if (task.isLocal) {
    setLocalTasks((prev: any[]) => prev.map((t) => (t.id === task.id ? { ...t, date: value } : t)));
    return;
  }

  setLocalTasks((prev: any[]) => [
    {
      ...task,
      date: value,
      isLocal: true,
    },
    ...prev,
  ]);
}

export function getDaysLeft(dateStr: string) {
  const [day, month, year] = dateStr.split('/').map(Number);

  const targetDate = new Date(year, month - 1, day);
  const today = new Date();

  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays <= 3) return `${diffDays} Days Left`;

  return null;
}
