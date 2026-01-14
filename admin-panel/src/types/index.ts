export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'sale' | 'rent';
  property_type: 'apartment' | 'house' | 'villa' | 'commercial' | 'land';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  location: string;
  address: string;
  features: string[];
  images: string[];
  developer_name: string;
  developer_phone: string;
  developer_whatsapp?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  lat?: number;
  lng?: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  image_url?: string;
  category?: string;
  status?: 'published' | 'draft';
  views?: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface UploadedFile {
  id: string;
  original_filename: string;
  stored_filename: string;
  file_path: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  uploaded_by: string;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: 'text' | 'number' | 'boolean' | 'json';
  description?: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  property_type: 'rent' | 'buy';
  budget: string;
  location: string;
  contact: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: 'new' | 'read' | 'replied';
}
