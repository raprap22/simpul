'use client';

import { useInbox } from '@/hooks/inbox';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Search from '../../../public/Icon/Search.png';
import LoadingState from '../Loading';

interface ListProps {
  onSelect: (id: string) => void;
}

export function List({ onSelect }: ListProps) {
  const { threadsQuery } = useInbox();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState('');

  const threads = threadsQuery.data?.pages.flatMap((p) => p.threads) ?? [];

  const filteredThreads = threads.filter((t) => {
    const keyword = search.toLowerCase();
    return t.senderName.toLowerCase().includes(keyword) || t.title.toLowerCase().includes(keyword);
  });

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          threadsQuery.hasNextPage &&
          !threadsQuery.isFetchingNextPage
        ) {
          threadsQuery.fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [threadsQuery]);

  return (
    <div className="h-184.25 overflow-auto px-8 py-6 w-183.5">
      <div className="relative min-w-160 mb-6">
        <input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-16 py-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-[#2E81ED]/40 bg-white text-[#333333]"
        />
        <div className="absolute right-20 top-1/2 -translate-y-1/2 pointer-events-none">
          <Image src={Search} alt="search" width={16} height={16} />
        </div>
      </div>
      <div className="space-y-6">
        {filteredThreads.length === 0 && !threadsQuery.isLoading && (
          <p className="text-center text-gray-400">No conversations found</p>
        )}

        {filteredThreads.map((t) => (
          <div
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="cursor-pointer border-b pb-4 flex gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-[#2E81ED] text-white flex items-center justify-center font-semibold">
              {t.senderName.charAt(0)}
            </div>

            <div className="flex-1">
              <div className="flex gap-4 items-center">
                <p className="font-semibold text-[#2E81ED]">{t.senderName}</p>
                <span className="text-sm text-gray-400">{t.createdAt}</span>
              </div>

              <p className="text-gray-600">
                {t.title.length > 50 ? `${t.title.slice(0, 50)}…` : t.title}
              </p>
            </div>

            {t.unread && <span className="w-2 h-2 bg-red-500 rounded-full mt-2" />}
          </div>
        ))}

        {threadsQuery.isLoading && <LoadingState text="Loading Chats..." />}
      </div>

      <div ref={loadMoreRef} className="h-10" />

      {threadsQuery.isFetchingNextPage && filteredThreads.length === 0 && (
        <p className="text-center text-gray-400 py-4">Loading more...</p>
      )}
    </div>
  );
}
