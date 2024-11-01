export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_id: string;
          author_name: string;
          created_at: string;
          updated_at: string;
          cover_image: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          author_id: string;
          author_name: string;
          created_at?: string;
          updated_at?: string;
          cover_image?: string | null;
        };
        Update: {
          title?: string;
          content?: string;
          updated_at?: string;
          cover_image?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          content: string;
          author_id: string;
          author_name: string;
          post_id: string;
          parent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          author_id: string;
          author_name: string;
          post_id: string;
          parent_id?: string | null;
          created_at?: string;
        };
        Update: {
          content?: string;
        };
      };
    };
  };
}