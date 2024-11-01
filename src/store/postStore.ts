import { create } from 'zustand';
import { Post, Comment } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface PostStore {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  addPost: (post: Omit<Post, 'id' | 'comments' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePost: (id: string, updatedPost: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          comments (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const posts = data.map((post) => ({
        ...post,
        createdAt: new Date(post.created_at),
        updatedAt: new Date(post.updated_at),
        comments: post.comments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.created_at),
        })),
      }));

      set({ posts, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addPost: async (post) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          title: post.title,
          content: post.content,
          author_id: user.id,
          author_name: post.author,
          cover_image: post.coverImage,
        })
        .select()
        .single();

      if (error) throw error;
      await get().fetchPosts();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updatePost: async (id, updatedPost) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: updatedPost.title,
          content: updatedPost.content,
          cover_image: updatedPost.coverImage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      await get().fetchPosts();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deletePost: async (id) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      await get().fetchPosts();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  addComment: async (postId, comment) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: comment.content,
          author_id: user.id,
          author_name: comment.author,
          post_id: postId,
          parent_id: comment.parentId,
        })
        .select()
        .single();

      if (error) throw error;
      await get().fetchPosts();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));