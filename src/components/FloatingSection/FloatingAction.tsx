'use client';

import { useState } from 'react';
import MenuFloating from './MenuFloating';
import Float from '../../../public/Icon/Floating.png';
import InboxOpen from '../../../public/Icon/InboxOpen.png';
import TaskOpen from '../../../public/Icon/TaskOpen.png';
import Image from 'next/image';

interface FloatingActionProps {
  setAction: (action: string) => void;
}

export default function FloatingAction({ setAction }: FloatingActionProps) {
  const [open, setOpen] = useState(false);
  const [action, setActionFloat] = useState('');

  const handleSetAction = (e: string) => {
    setAction(e);
    setActionFloat(e);
  };

  const iconUsed = (e: string) => {
    switch (e) {
      case 'inbox':
        return InboxOpen;
      case 'task':
        return TaskOpen;
      default:
        return Float;
    }
  };

  return (
    <div className="flex flex-col items-end m-5">
      <div className="flex flex-row items-end gap-4">
        {open && <MenuFloating setAction={(e: string) => handleSetAction(e)} />}
        <div className="flex">
          <button onClick={() => setOpen(!open)} className={`relative w-15 h-15 ${action !== '' && 'mr-5'}`}>
            {action !== '' && <div className="absolute inset-0 rounded-full bg-[#4F4F4F]" />}
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                action !== '' && 'translate-x-4'
              }`}
            >
              <Image src={iconUsed(action)} alt="float" width={60} className="z-10" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
