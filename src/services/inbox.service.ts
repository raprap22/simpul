import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

const PAGE_SIZE = 10;

export const inboxService = {
  async getUsers() {
    const { data } = await api.get('/users');
    return data.users;
  },

  async getThreads({ pageParam = 0 }: { pageParam?: number }) {
    const skip = pageParam * PAGE_SIZE;

    const { data } = await api.get('/posts', {
      params: {
        limit: PAGE_SIZE,
        skip,
      },
    });

    const threads = await Promise.all(
      data.posts.map(async (post: any) => {
        const { data: user } = await api.get(`/users/${post.userId}`);

        return {
          id: String(post.id),
          title: post.body,
          senderName: `${user.firstName} ${user.lastName}`,
          unread: Math.random() > 0.5,
          createdAt: '01/06/2021 12:19',
        };
      })
    );

    return {
      threads,
      nextPage: skip + PAGE_SIZE < data.total ? pageParam + 1 : undefined,
    };
  },

  async getMessages(threadId: string) {
    const { data } = await api.get(`/comments/post/${threadId}`);

    return data.comments.map((c: any) => ({
      id: String(c.id),
      text: c.body,
      createdAt: new Date().toISOString(),

      user: {
        id: c.user.id,
        username: c.user.username,
        fullName:
          c.user.firstName && c.user.lastName
            ? `${c.user.firstName} ${c.user.lastName}`
            : c.user.username,
      },
    }));
  },

  async sendMessage(threadId: string, text: string) {
    const { data } = await api.post('/comments/add', {
      postId: threadId,
      body: text,
      userId: 1,
    });

    return {
      id: `temp-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),

      user: {
        id: 1,
        username: 'me',
        fullName: 'You',
      },
    };
  },

  async deleteMessage(messageId: string) {
    const { data } = await api.delete(`/comments/${messageId}`);
    return data;
  },

  async updateMessage(messageId: string, text: string) {
    const { data } = await api.put(`/comments/${messageId}`, {
      body: text,
    });

    return data;
  },
};
