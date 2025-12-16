import Image from 'next/image';
import Inbox from '../../../../public/Icon/Inbox.png';

interface InboxPanelProps {
  setAction: (action: string) => void;
}

export default function InboxPanel({ setAction }: InboxPanelProps) {
  return (
    <button
      className="flex flex-col items-center gap-3 text-white"
      onClick={() => setAction('inbox')}
    >
      <span className="text-sm font-medium">Inbox</span>
      <Image src={Inbox} alt="inbox" width={60} />
    </button>
  );
}
