'use client';

import FloatingAction from '@/components/FloatingSection/FloatingAction';
import Inbox from '@/components/Inbox';
import AppShell from '@/components/layout/Appshel';
import Task from '@/components/Task';
import { useState } from 'react';

export default function Home() {
  const [action, setAction] = useState('none');

  return (
    <AppShell>
      <div className="flex flex-col items-end">
        {action === 'inbox' && <Inbox />}
        {action === 'task' && <Task />}
        <FloatingAction setAction={(e: string) => setAction(e)} />
      </div>
    </AppShell>
  );
}
