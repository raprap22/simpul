import { useState } from 'react';
import InboxPanel from './Panel/InboxPanel';
import TaskPanel from './Panel/TaskPanel';

interface MenuFloatingProps {
  setAction: (action: string) => void;
}

export default function MenuFloating({ setAction }: MenuFloatingProps) {
  const [action, setActionFloat] = useState('');

  const handleSetAction = (e: string) => {
    setAction(e);
    setActionFloat(e);
  };

  return (
    <div className="flex flex-row gap-4">
      {action !== 'task' && <TaskPanel setAction={(e: string) => handleSetAction(e)} />}
      {action !== 'inbox' && <InboxPanel setAction={(e: string) => handleSetAction(e)} />}
    </div>
  );
}
