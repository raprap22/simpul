interface MessageActionProps {
  onEdit: () => void;
  onDelete: () => void;
  onReply: () => void;
  isMe: boolean;
}

export function MessageAction({ onEdit, onDelete, onReply, isMe }: MessageActionProps) {
  return (
    <div
      className={`absolute z-50 w-32 ${
        isMe ? '-mt-20 -ml-10' : '-mt-10 ml-30'
      } rounded-lg bg-white border border-[#BDBDBD] overflow-hidden`}
    >
      <button
        onClick={isMe ? onEdit : undefined}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 font-light text-[#2F80ED]"
      >
        {isMe ? 'Edit' : 'Share'}
      </button>

      <div className="h-px bg-[#BDBDBD]" />

      <button
        onClick={isMe ? onDelete : onReply}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 font-light"
        style={{ color: isMe ? '#EB5757' : '#2F80ED' }}
      >
        {isMe ? 'Delete' : 'Reply'}
      </button>
    </div>
  );
}
