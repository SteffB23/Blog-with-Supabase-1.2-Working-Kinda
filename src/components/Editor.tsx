import React from 'react';
import { MDXEditor } from '@mdxeditor/editor';
import { motion } from 'framer-motion';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      <MDXEditor
        markdown={content}
        onChange={onChange}
        contentEditableClassName="prose max-w-none p-4 min-h-[200px] focus:outline-none"
      />
    </motion.div>
  );
};