import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Image, X } from 'lucide-react';
import { ImageUploadProps } from '../types';

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, currentImage }) => {
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageUpload(base64);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  return (
    <div className="mb-6">
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Cover"
            className="h-48 w-full rounded-lg object-cover"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onImageUpload('')}
            className="absolute right-2 top-2 rounded-full bg-white/80 p-2 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>
      ) : (
        <motion.label
          whileHover={{ scale: 1.01 }}
          className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Image className="mb-3 h-10 w-10 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 5MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </motion.label>
      )}
    </div>
  );
};