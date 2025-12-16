import Image from 'next/image';
import Task from '../../../../public/Icon/Task.png';

interface InboxPanelProps {
  setAction: (action: string) => void;
}

export default function TaskPanel({ setAction }: InboxPanelProps) {
  return (
    <button
      className="flex flex-col items-center gap-3 text-white"
      onClick={() => setAction('task')}
    >
      <span className="text-sm font-medium">Task</span>
      <Image src={Task} alt="task" width={60} />
    </button>
  );
}
