export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  type: 'sale' | 'rent' | 'lease';
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  features?: string[];
  images?: string[];
  developer_name?: string;
  developer_phone?: string;
  developer_whatsapp?: string;
  virtual_walkthrough_url?: string;
  map_virtual_tour_url?: string;
  is_featured?: boolean;
  status?: 'available' | 'sold' | 'rented';
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFilters {
  type?: 'sale' | 'rent' | 'lease';
  property_type?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
}
