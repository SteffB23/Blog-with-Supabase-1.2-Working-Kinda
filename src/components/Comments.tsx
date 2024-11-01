import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, CornerDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { Comment } from '../types';
import { usePostStore } from '../store/postStore';

interface CommentsProps {
  postId: string;
  comments: Comment[];
}

interface CommentFormProps {
  postId: string;
  parentId: string | null;
  onSubmit: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, parentId, onSubmit }) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const { addComment } = usePostStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !author.trim()) return;

    addComment(postId, {
      content: content.trim(),
      author: author.trim(),
      parentId,
      postId,
    });

    setContent('');
    setAuthor('');
    onSubmit();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        rows={3}
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={!content.trim() || !author.trim()}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit
      </motion.button>
    </motion.form>
  );
};

const CommentItem: React.FC<{ comment: Comment; postId: string; level?: number }> = ({
  comment,
  postId,
  level = 0,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const { posts } = usePostStore();
  const replies = posts
    .find((p) => p.id === postId)
    ?.comments.filter((c) => c.parentId === comment.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative mt-4 ${level > 0 ? 'ml-8' : ''}`}
    >
      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium text-gray-900">{comment.author}</span>
          <time className="text-sm text-gray-500">
            {format(comment.createdAt, 'MMM d, yyyy')}
          </time>
        </div>
        <p className="text-gray-700">{comment.content}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsReplying(!isReplying)}
          className="mt-2 flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <CornerDownRight size={16} />
          <span>Reply</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isReplying && (
          <div className="mt-4 ml-8">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              onSubmit={() => setIsReplying(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {replies && replies.length > 0 && (
        <div className="space-y-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const Comments: React.FC<CommentsProps> = ({ postId, comments }) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const rootComments = comments.filter((comment) => !comment.parentId);

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-gray-900" />
          <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCommenting(!isCommenting)}
          className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Add Comment
        </motion.button>
      </div>

      <AnimatePresence>
        {isCommenting && (
          <div className="mb-6">
            <CommentForm
              postId={postId}
              parentId={null}
              onSubmit={() => setIsCommenting(false)}
            />
          </div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {rootComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};