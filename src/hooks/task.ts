import { todosService } from '@/services/task.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useTodos() {
  const queryClient = useQueryClient();

  const todosQuery = useQuery({
    queryKey: ['todos'],
    queryFn: todosService.getTodos,
  });

  const updateTodo = useMutation({
    mutationFn: ({ todoId, payload }: any) => todosService.updateTodo(todoId, payload),
    onMutate: async ({ todoId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<any[]>(['todos']);

      queryClient.setQueryData(['todos'], (old: any[]) =>
        old?.map((t) => (t.id === todoId ? { ...t, ...payload } : t))
      );

      return { previousTodos };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
  });

  const deleteTodo = useMutation({
    mutationFn: ({ todoId }: { todoId: string }) => todosService.deleteTodo(todoId),
    onMutate: async ({ todoId }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<any[]>(['todos']);

      queryClient.setQueryData(['todos'], (old: any[]) => old?.filter((t) => t.id !== todoId));

      return { previousTodos };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
  });

  const createTodo = useMutation({
    mutationFn: (payload: { title: string }) => todosService.createTodo(payload),
    onSuccess: (newTodo) => {
      queryClient.setQueryData(['todos'], (old: any[] = []) => [newTodo, ...old]);
    },
  });

  return {
    todosQuery,
    isLoading: todosQuery.isLoading,
    isInitialLoading: todosQuery.isLoading && !todosQuery.data,
    isFetching: todosQuery.isFetching,
    createTodo,
    updateTodo,
    deleteTodo,
  };
}
