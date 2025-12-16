import { useState } from 'react';
import Card from '../Card';
import { Detail } from './Detail';
import { List } from './List';

export default function Inbox() {
  const [activeThread, setActiveThread] = useState<string | null>(null);

  return (
    <div className="mr-5">
      <Card>
        {!activeThread ? (
          <List onSelect={setActiveThread} />
        ) : (
          <Detail threadId={activeThread} onBack={() => setActiveThread(null)} />
        )}
      </Card>
    </div>
  );
}
