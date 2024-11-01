import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Post } from '../types';
import { Comments } from './Comments';

interface PostCardProps {
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-48 w-full rounded-t-lg object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">{post.title}</h2>
        <div className="mb-4 flex items-center space-x-2 text-sm text-gray-500">
          <span className="font-medium text-gray-900">{post.author}</span>
          <span>•</span>
          <time>{format(post.updatedAt, 'MMM d, yyyy')}</time>
        </div>
        <div className="prose max-w-none text-gray-700">
          {post.content.slice(0, 200)}...
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <MessageCircle size={18} />
            <span>{post.comments.length} Comments</span>
          </motion.button>
          
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            >
              <Edit2 size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDelete}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            >
              <Trash2 size={18} />
            </motion.button>
          </div>
        </div>

        {showComments && (
          <Comments postId={post.id} comments={post.comments} />
        )}
      </div>
    </motion.div>
  );
};