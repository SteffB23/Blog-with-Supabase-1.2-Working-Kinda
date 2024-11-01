export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  coverImage?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  parentId: string | null;
  postId: string;
}

export interface ImageUploadProps {
  onImageUpload: (base64: string) => void;
  currentImage?: string;
}