import { Icon } from '@iconify/react';

type Props = {
  openDropdown: boolean;
  setOpenDropdown: (v: boolean) => void;
  activeTask: 'task1' | 'task2';
  setActiveTask: (v: 'task1' | 'task2') => void;
  onNewTask: () => void;
};

export default function TaskHeader({
  openDropdown,
  setOpenDropdown,
  activeTask,
  setActiveTask,
  onNewTask,
}: Props) {
  return (
    <div className="flex items-center justify-between px-5 pt-5.5">
      <div className="relative">
        <div className="w-72.25 flex flex-row justify-center">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-2 border-[#828282] border rounded-[5px] px-4 py-2 text-sm font-medium"
          >
            {activeTask === 'task1' ? 'Task 1' : 'Task 2'}
            <Icon icon="mdi:chevron-down" width={18} />
          </button>
        </div>

        {openDropdown && (
          <div className="absolute left-0 mt-2 w-56 bg-white border-[#828282] border rounded-[5px] shadow-lg">
            {(['task1', 'task2'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTask(t);
                  setOpenDropdown(false);
                }}
                className="w-full px-4 py-3 text-left border-[#828282] border-b cursor-pointer"
              >
                {t === 'task1' ? 'Task 1' : 'Task 2'}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onNewTask}
        className="bg-[#2F80ED] text-white px-2 h-10 w-24.75 rounded-[5px] font-light text-base"
      >
        New Task
      </button>
    </div>
  );
}
