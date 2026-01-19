export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value?: string;
  setting_type: 'text' | 'number' | 'boolean' | 'json';
  description?: string;
  updated_at?: string;
}

export interface UploadedFile {
  id: string;
  original_filename: string;
  stored_filename: string;
  file_path: string;
  file_size: number;
  file_type?: string;
  mime_type?: string;
  uploaded_by?: string;
  created_at?: string;
}

export interface Inquiry {
  id: string;
  property_type: 'rent' | 'buy';
  budget?: string;
  location?: string;
  contact?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  property_id?: string;
  status: 'new' | 'read' | 'replied';
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating?: number;
  image_url?: string;
  is_featured?: boolean;
  status: 'published' | 'draft';
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  email?: string;
  phone?: string;
  social_links?: Record<string, string>;
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  subscribed_at?: string;
}

export interface LegalContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  updated_at?: string;
}

export interface ContactStats {
  total: number;
  new: number;
  read: number;
  replied: number;
}
