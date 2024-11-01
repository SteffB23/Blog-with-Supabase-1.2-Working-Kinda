import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, X, LogOut } from 'lucide-react';
import { Editor } from './components/Editor';
import { PostCard } from './components/PostCard';
import { ImageUpload } from './components/ImageUpload';
import { Auth } from './components/Auth';
import { usePostStore } from './store/postStore';
import { useAuthStore } from './store/authStore';
import { Post } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<Post>>({});
  const { posts, fetchPosts, addPost, updatePost, deletePost } = usePostStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, fetchPosts]);

  const handleSave = () => {
    if (!currentPost.title?.trim() || !currentPost.author?.trim()) {
      return;
    }

    if (currentPost.id) {
      updatePost(currentPost.id, currentPost);
    } else {
      addPost({
        title: currentPost.title.trim(),
        author: currentPost.author.trim(),
        content: currentPost.content || '',
        coverImage: currentPost.coverImage,
      });
    }
    setIsEditing(false);
    setCurrentPost({});
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-md">
          <div className="mb-8 flex items-center justify-center">
            <PenTool className="mr-2 h-8 w-8" />
            <h1 className="text-2xl font-bold">Support Blog</h1>
          </div>
          <Auth />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 z-10 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PenTool className="h-6 w-6 text-gray-900" />
              <h1 className="text-xl font-bold text-gray-900">Support Blog</h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                New Post
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => supabase.auth.signOut()}
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
              >
                <LogOut size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 pt-24">
        <AnimatePresence>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  <input
                    type="text"
                    value={currentPost.title || ''}
                    onChange={(e) =>
                      setCurrentPost({ ...currentPost, title: e.target.value })
                    }
                    placeholder="Post title"
                    className="w-full border-none text-2xl font-bold focus:outline-none focus:ring-0"
                  />
                  <input
                    type="text"
                    value={currentPost.author || ''}
                    onChange={(e) =>
                      setCurrentPost({ ...currentPost, author: e.target.value })
                    }
                    placeholder="Your name"
                    className="w-full border-none text-sm text-gray-600 focus:outline-none focus:ring-0"
                  />
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <ImageUpload
                onImageUpload={(base64) =>
                  setCurrentPost({ ...currentPost, coverImage: base64 })
                }
                currentImage={currentPost.coverImage}
              />

              <Editor
                content={currentPost.content || ''}
                onChange={(content) => setCurrentPost({ ...currentPost, content })}
              />
              <div className="mt-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={!currentPost.title?.trim() || !currentPost.author?.trim()}
                  className="rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {currentPost.id ? 'Update' : 'Publish'}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={() => {
                    setCurrentPost(post);
                    setIsEditing(true);
                  }}
                  onDelete={() => deletePost(post.id)}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;