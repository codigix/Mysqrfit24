export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  min_price?: number;
  max_price?: number;
  price: number;
  type: 'sale' | 'rent' | 'lease';
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  plot_area?: number;
  location?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  facing?: string;
  flooring?: string;
  parking?: number;
  age?: number;
  furnishing?: 'unfurnished' | 'semi-furnished' | 'furnished';
  features?: string[];
  images?: string[];
  developer_name?: string;
  developer_email?: string;
  developer_phone?: string;
  developer_whatsapp?: string;
  developer_avatar?: string;
  virtual_walkthrough_url?: string;
  video_tour_url?: string;
  map_virtual_tour_url?: string;
  is_featured?: boolean;
  status?: 'available' | 'sold' | 'rented';
  lease_amount?: number;
  lease_duration?: string;
  lease_deposit?: number;
  created_at?: string;
  updated_at?: string;
  propertyId?: string;
  yearBuilt?: number;
  floorPlanImage?: string;
  videoThumbnail?: string;
  videoUrl?: string;
  rooms?: number;
  garages?: number;
  lotSize?: number;
  reviews?: Review[];
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
