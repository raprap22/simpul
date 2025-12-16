import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { inboxService } from '@/services/inbox.service';

export function useInbox(activeThread?: string) {
  const queryClient = useQueryClient();

  const threadsQuery = useInfiniteQuery({
    queryKey: ['threads'],
    queryFn: ({ pageParam }) => inboxService.getThreads({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const messagesQuery = useQuery({
    queryKey: ['messages', activeThread],
    queryFn: () => inboxService.getMessages(activeThread!),
    enabled: !!activeThread,
  });

  const sendMessage = useMutation({
    mutationFn: ({ threadId, text }: any) => inboxService.sendMessage(threadId, text),
    onSuccess: (msg, { threadId }) => {
      queryClient.setQueryData(['messages', threadId], (old: any) => [...(old ?? []), msg]);
    },
  });

  const deleteMessage = useMutation({
    mutationFn: ({ messageId }: { messageId: string }) => inboxService.deleteMessage(messageId),

    onMutate: async ({ messageId }) => {
      await queryClient.cancelQueries({
        queryKey: ['messages', activeThread],
      });

      const previousMessages = queryClient.getQueryData<any[]>(['messages', activeThread]);

      queryClient.setQueryData(['messages', activeThread], (old: any[]) =>
        old?.filter((m) => m.id !== messageId)
      );

      return { previousMessages };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', activeThread], context.previousMessages);
      }
    },
  });

  const updateMessage = useMutation({
    mutationFn: ({ messageId, text }: { messageId: string; text: string }) =>
      inboxService.updateMessage(messageId, text),

    onMutate: async ({ messageId, text }) => {
      await queryClient.cancelQueries({
        queryKey: ['messages', activeThread],
      });

      const previousMessages = queryClient.getQueryData<any[]>(['messages', activeThread]);

      queryClient.setQueryData(['messages', activeThread], (old: any[]) =>
        old?.map((m) => (m.id === messageId ? { ...m, text } : m))
      );

      return { previousMessages };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', activeThread], context.previousMessages);
      }
    },
  });

  return {
    threadsQuery,
    messagesQuery,
    sendMessage,
    deleteMessage,
    updateMessage,
  };
}
