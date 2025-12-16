import { useInbox } from '@/hooks/inbox';
import { getUserColor } from '@/utils';
import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import DetailIcon from '../../../public/Icon/Detail.png';
import { MessageAction } from './MessageAction';

const CURRENT_USER_ID = 1;

interface DetailProps {
  threadId: string;
  onBack: () => void;
}

export function Detail({ threadId, onBack }: DetailProps) {
  const { messagesQuery, sendMessage, deleteMessage, updateMessage } = useInbox(threadId);

  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [replyTo, setReplyTo] = useState<any | null>(null);

  const participants = useMemo(() => {
    if (!messagesQuery.data) return [];

    const map = new Map<number, string>();
    messagesQuery.data.forEach((m: any) => {
      if (m.user?.id) {
        map.set(m.user.id, m.user.fullName);
      }
    });

    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [messagesQuery.data]);

  const isGroup = participants.length > 1;
  const privateUser = participants.find((p) => p.id !== CURRENT_USER_ID);

  return (
    <div className="flex flex-col h-184.25 bg-white rounded-lg">
      <div className="flex items-center gap-4 px-6 py-4 border-b">
        <button onClick={onBack} className="text-[#2E81ED] hover:opacity-80">
          <Icon icon="mdi:arrow-left" width={22} />
        </button>

        <div className="flex flex-col">
          <p className="font-semibold text-sm">
            {isGroup ? `Thread #${threadId}` : privateUser?.name ?? 'Chat'}
          </p>

          <span className="text-xs text-gray-400">
            {isGroup ? `${participants.length + 1} participants` : '2 participants'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4 space-y-5">
        {messagesQuery.data?.map((m: any) => {
          const isMe = m.user?.id === CURRENT_USER_ID;
          const color = getUserColor(m.user?.id ?? 0);
          
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[75%] ${
                isMe ? 'ml-auto flex-row-reverse text-right' : ''
              }`}
            >
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <p
                  className={`text-sm font-semibold mb-1 ${isMe ? 'text-right' : ''}`}
                  style={{ color: color.accent }}
                >
                  {m.user.fullName}
                </p>
                {isMe && replyTo && (
                  <div className="my-2 rounded-sm px-4 py-3 text-sm relative max-w-125 wrap-break-word border-[#E0E0E0] border bg-[#F2F2F2]">
                    <p>{replyTo.text}</p>
                  </div>
                )}
                {editingId === m.id ? (
                  <div className="flex gap-2">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => {
                        updateMessage.mutate({
                          messageId: m.id,
                          text: editText,
                        });
                        setEditingId(null);
                      }}
                      className="text-sm text-blue-500"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      className="rounded-sm px-4 py-3 text-sm relative max-w-125 wrap-break-word w-fit"
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                      }}
                    >
                      {m.text}
                      <button
                        onClick={() => setOpenMenuId(openMenuId === m.id ? null : m.id)}
                        className={`absolute ${!isMe ? '-right-5' : '-left-5'} -top-1`}
                      >
                        <Image src={DetailIcon} width={16} alt="detail" />
                      </button>
                    </div>
                    {openMenuId === m.id && (
                      <MessageAction
                        isMe={isMe}
                        onEdit={() => {
                          setEditingId(m.id);
                          setEditText(m.text);
                          setOpenMenuId(null);
                        }}
                        onDelete={() => {
                          deleteMessage.mutate(m.id);
                          setOpenMenuId(null);
                        }}
                        onReply={() => {
                          setReplyTo(m);
                          setOpenMenuId(null);
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 flex flex-row gap-2 h-30 w-full items-end ">
        <div className="flex flex-col w-full">
          {replyTo && (
            <div className="border border-[#828282] rounded-t-[5px] p-3 bg-[#F2F2F2] relative border-b-0">
              <button
                onClick={() => setReplyTo(null)}
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <p className="text-sm font-semibold mb-1">Replying to {replyTo.user.fullName}</p>

              <p className="text-sm text-gray-600 truncate">{replyTo.text}</p>
            </div>
          )}

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a new message"
            className={`flex border ${
              !replyTo ? 'rounded-[5px]' : 'rounded-b-[5px]'
            }  p-3 h-10 border-[#828282]`}
            disabled={isSending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isSending && text.trim()) {
                  setIsSending(true);
                  sendMessage.mutate({ threadId, text });
                  setText('');

                  setTimeout(() => setIsSending(false), 500);
                }
              }
            }}
          />
        </div>
        <button
          disabled={isSending || !text.trim()}
          onClick={() => {
            setIsSending(true);
            sendMessage.mutate({
              threadId,
              text,
              replyToId: replyTo?.id,
            });
            setReplyTo(null);
            setText('');

            setTimeout(() => setIsSending(false), 500);
          }}
          className={`px-4 h-10 rounded-md text-white transition ${
            isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2E81ED]'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
