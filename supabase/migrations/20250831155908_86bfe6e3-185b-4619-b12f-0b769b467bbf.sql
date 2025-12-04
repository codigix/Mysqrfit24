-- Create properties table for real estate listings
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'villa', 'commercial', 'land')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area DECIMAL(10,2) NOT NULL, -- in square feet/meters
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  features TEXT[], -- array of features like ["parking", "garden", "pool"]
  images TEXT[], -- array of image URLs
  developer_name TEXT NOT NULL,
  developer_phone TEXT NOT NULL,
  developer_whatsapp TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no authentication needed)
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties 
FOR SELECT 
USING (true);

-- Create policies for admin management (you can add admin authentication later if needed)
CREATE POLICY "Allow all operations for now" 
ON public.properties 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_properties_property_type ON public.properties(property_type);
CREATE INDEX idx_properties_location ON public.properties(location);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_is_featured ON public.properties(is_featured);

-- Insert sample data
INSERT INTO public.properties (
  title, description, price, type, property_type, bedrooms, bathrooms, area, location, address,
  features, images, developer_name, developer_phone, developer_whatsapp, is_featured
) VALUES 
(
  'Luxury Modern Villa', 
  'Stunning 4-bedroom villa with panoramic city views, private pool, and premium finishes throughout. Located in the prestigious Hills District.',
  1500000.00, 
  'sale', 
  'villa', 
  4, 
  3, 
  3500.00, 
  'Hills District', 
  '123 Luxury Lane, Hills District',
  ARRAY['parking', 'pool', 'garden', 'security', 'gym', 'balcony'],
  ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
  'Premium Developers Ltd',
  '+91 9112706604',
  '+91 9112706604',
  true
),
(
  'Modern Downtown Apartment',
  'Spacious 2-bedroom apartment in the heart of downtown. Walking distance to shopping, dining, and entertainment.',
  3500.00,
  'rent',
  'apartment',
  2,
  2,
  1200.00,
  'Downtown',
  '456 City Center Ave, Downtown',
  ARRAY['parking', 'gym', 'security', 'balcony'],
  ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
  'Urban Living Co',
  '+919112706604',
  '+919112706604',
  false
),
(
  'Cozy Family House',
  'Perfect family home with large backyard, updated kitchen, and quiet neighborhood setting.',
  850000.00,
  'sale',
  'house',
  3,
  2,
  1800.00,
  'Suburbs',
  '789 Family Street, Suburbs',
  ARRAY['parking', 'garden', 'fireplace'],
  ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800'],
  'Family Homes Inc',
  '+1234567892',
  '+1234567892',
  true
);