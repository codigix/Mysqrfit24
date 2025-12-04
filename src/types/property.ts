export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  type: 'sale' | 'rent';
  property_type: 'apartment' | 'house' | 'villa' | 'commercial' | 'land';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  location: string;
  address: string;
  latitude?: number;
  longitude?: number;
  features?: string[];
  images?: string[];
  developer_name: string;
  developer_phone: string;
  developer_whatsapp?: string;
  is_featured?: boolean;
  status?: 'available' | 'sold' | 'rented';
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFilters {
  type?: 'sale' | 'rent';
  property_type?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
}