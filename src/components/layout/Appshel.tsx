import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Workspace from './Workspace';
import React from 'react';

interface AppShellProps {
  children?: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#333333]">
      <Sidebar />

      <div className="flex flex-col flex-1 relative">
        <Topbar />
        <Workspace />
        {children}
      </div>
    </div>
  );
}
