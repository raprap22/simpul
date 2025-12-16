import {
  formatDate,
  getDaysLeft,
  getDescription,
  handleDeleteTask,
  handleEditDate,
  handleEditDescription,
  handleToggleComplete,
  parseDMY,
} from '@/utils';
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import Calendar from './Calendar';

export default function TaskContent({
  showNewTask,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription,
  onOpenModal,
  filteredOpenTasks,
  updateTodo,
  deleteTodo,
  setLocalTasks,
  newTaskDate,
  setNewTaskDate,
}: any) {
  const deleteRef = useRef<HTMLDivElement | null>(null);

  const [collapseNewTask, setCollapseNewTask] = useState(false);
  const [collapsedIds, setCollapsedIds] = useState<Record<string, boolean>>({});
  const [editingDescId, setEditingDescId] = useState<string | null>(null);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [showCalendar, setShowCalendar] = useState<string | null>(null);
  const [showNewTaskCalendar, setShowNewTaskCalendar] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const toggleCollapse = (id: string) => {
    setCollapsedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (deleteTargetId && deleteRef.current && !deleteRef.current.contains(e.target as Node)) {
        setDeleteTargetId(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [deleteTargetId]);

  return (
    <div className="p-5">
      {/* ================= NEW TASK ================= */}
      {showNewTask && (
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <input type="checkbox" disabled />

            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Type Task Title"
              className="flex-1 border rounded-md px-4 py-2"
            />

            <button onClick={() => setCollapseNewTask((v) => !v)}>
              <Icon icon={collapseNewTask ? 'mdi:chevron-down' : 'mdi:chevron-up'} width={20} />
            </button>

            <button onClick={onOpenModal}>
              <Icon icon="mdi:dots-horizontal" width={20} />
            </button>
          </div>

          {!collapseNewTask && (
            <>
              <div className="ml-6 mb-3 flex items-center gap-3 text-gray-500 relative">
                <Icon icon="mdi:clock-outline" width={20} />

                <div
                  className="border rounded-md px-4 py-2 flex flex-row justify-between items-center gap-3 cursor-pointer w-48.25"
                  onClick={() => setShowNewTaskCalendar(true)}
                >
                  {newTaskDate || 'Set Date'}
                  <Icon icon="mdi:calendar-blank-outline" width={18} />
                </div>

                {showNewTaskCalendar && (
                  <div className="absolute top-12 left-0 z-50 bg-white border border-[#828282] rounded-lg p-4">
                    <Calendar
                      value={newTaskDate ? parseDMY(newTaskDate) : undefined}
                      onClose={() => setShowNewTaskCalendar(false)}
                      onSelect={(date) => {
                        setNewTaskDate(formatDate(date));
                        setShowNewTaskCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="ml-6 flex items-start gap-3 text-gray-500">
                <Icon icon="mdi:pencil-outline" width={20} />

                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Type Description"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
            </>
          )}
        </section>
      )}

      {/* ================= OPEN TASK ================= */}
      <section>
        {filteredOpenTasks.map((t: any) => {
          const isCollapsed = collapsedIds[t.id];
          const isEditing = editingDescId === t.id;

          return (
            <div key={t.id} className="mb-6 border-b pb-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() =>
                    handleToggleComplete({
                      task: t,
                      setLocalTasks,
                      updateTodo,
                    })
                  }
                />

                <p
                  className={`flex-1 font-medium transition-all ${
                    t.completed ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {t.title}
                </p>
                <span className="text-sm font-light text-[#EB5757]">{getDaysLeft(t.date)}</span>

                <span className="text-gray-500">{t.date}</span>

                <button onClick={() => toggleCollapse(t.id)}>
                  <Icon icon={isCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'} width={20} />
                </button>

                <button onClick={() => setDeleteTargetId(t.id)}>
                  <Icon icon="mdi:dots-horizontal" width={20} />
                </button>
              </div>
              {deleteTargetId === t.id && (
                <div className="relative">
                  <div
                    ref={deleteRef}
                    className="absolute right-0 top-2 z-50 rounded-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="w-32 h-10.75 rounded-lg border border-[#828282] text-[#EB5757] font-light bg-white"
                      onClick={() => {
                        handleDeleteTask({
                          task: t,
                          setLocalTasks,
                          deleteTodo,
                        });
                        setDeleteTargetId(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {!isCollapsed && (
                <>
                  <div className="ml-6 mb-3 flex items-center gap-3 text-gray-500 mt-2.5">
                    <Icon icon="mdi:clock-outline" width={20} className="text-blue-500" />

                    <label
                      className={`border rounded-md px-4 py-2 flex flex-row justify-between items-center gap-3 w-48.25 ${
                        t.completed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      onClick={() => {
                        if (t.completed) return;
                        setShowCalendar(t.id);
                      }}
                    >
                      {t.date}
                      <Icon icon="mdi:calendar-blank-outline" width={18} />

                      <input
                        type="date"
                        className="hidden"
                        onChange={(e) => {
                          if (!e.target.value) return;

                          setNewTaskDate(formatDate(new Date(e.target.value)));
                        }}
                      />
                    </label>
                  </div>
                  {showCalendar === t.id && (
                    <div className="absolute z-50 mt-2 bg-white border border-[#828282] rounded-lg p-4">
                      <Calendar
                        value={parseDMY(t.date)}
                        onClose={() => setShowCalendar(null)}
                        onSelect={(date) => {
                          handleEditDate({
                            task: t,
                            value: formatDate(date),
                            setLocalTasks,
                          });
                          setShowCalendar(null);
                        }}
                      />
                    </div>
                  )}

                  <div className="ml-6 mt-3 flex items-start gap-3 ">
                    <button
                      onClick={() => {
                        setEditingDescId(t.id);
                        setDescriptions((prev) => ({
                          ...prev,
                          [t.id]: getDescription(t.id, t.title, descriptions),
                        }));
                      }}
                    >
                      <Icon icon="mdi:pencil-outline" width={20} className="text-blue-500" />
                    </button>

                    {isEditing ? (
                      <textarea
                        value={t.isLocal ? t.description : descriptions[t.id]}
                        onChange={(e) =>
                          handleEditDescription({
                            task: t,
                            value: e.target.value,
                            setLocalTasks,
                            setDescriptions,
                          })
                        }
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        onBlur={() => setEditingDescId(null)}
                      />
                    ) : (
                      <p
                        onClick={() => {
                          setEditingDescId(t.id);
                          setDescriptions((prev) => ({
                            ...prev,
                            [t.id]: getDescription(t.id, t.title, descriptions),
                          }));
                        }}
                        className="cursor-pointer"
                      >
                        {t.isLocal
                          ? t.description !== ''
                            ? t.description
                            : 'No Description'
                          : getDescription(t.id, t.title, descriptions)}
                        {t.isLocal ? (
                          <span className="font-bold"> From Local </span>
                        ) : (
                          <span className="font-bold"> From API</span>
                        )}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
