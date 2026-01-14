export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  image_url?: string;
  category?: string;
  status: 'published' | 'draft';
  views?: number;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}
