import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const dummyProperties = [
  {
    title: 'Modern Luxury Apartment in Downtown',
    description: 'Beautiful 3-bedroom apartment with stunning city views, modern amenities, and premium finishes.',
    price: 750000,
    type: 'sale',
    property_type: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    location: 'Downtown Dubai',
    address: '123 Marina Boulevard, Dubai',
    latitude: 25.1922,
    longitude: 55.2769,
    features: JSON.stringify(['Gym', 'Swimming Pool', 'Security', 'Parking', 'Balcony']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
      'https://images.unsplash.com/photo-1545324418-cc1a9d6faf4f?w=500',
    ]),
    developer_name: 'Emaar Properties',
    developer_phone: '+971501234567',
    developer_whatsapp: '+971501234567',
    is_featured: 1,
  },
  {
    title: 'Spacious Villa with Garden',
    description: 'Luxurious 4-bedroom villa with private garden, swimming pool, and modern design.',
    price: 1200000,
    type: 'sale',
    property_type: 'villa',
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    location: 'Arabian Ranches',
    address: '456 Villa Street, Dubai',
    latitude: 25.0631,
    longitude: 55.1531,
    features: JSON.stringify(['Swimming Pool', 'Garden', 'Security', 'Parking', 'Tennis Court']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
      'https://images.unsplash.com/photo-1613490493976-909e2648937b?w=500',
    ]),
    developer_name: 'Damac Properties',
    developer_phone: '+971502345678',
    developer_whatsapp: '+971502345678',
    is_featured: 1,
  },
  {
    title: 'Cozy Studio Apartment',
    description: 'Compact studio apartment perfect for students or professionals, well-furnished.',
    price: 1500,
    type: 'rent',
    property_type: 'apartment',
    bedrooms: 0,
    bathrooms: 1,
    area: 500,
    location: 'Deira',
    address: '789 Al Khaleej Street, Dubai',
    latitude: 25.2708,
    longitude: 55.3167,
    features: JSON.stringify(['Furnished', 'Parking', 'Security']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500',
    ]),
    developer_name: 'Real Estate Pro',
    developer_phone: '+971503456789',
    developer_whatsapp: '+971503456789',
    is_featured: 0,
  },
  {
    title: 'Contemporary House in Suburbs',
    description: '3-bedroom house in quiet residential area with modern architecture and all amenities.',
    price: 850000,
    type: 'sale',
    property_type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    area: 2000,
    location: 'Suburbs',
    address: '321 Residential Road, Dubai',
    latitude: 25.2048,
    longitude: 55.2708,
    features: JSON.stringify(['Garden', 'Parking', 'Security Gate', 'Spacious']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1572120471610-3677c3ce3c63?w=500',
      'https://images.unsplash.com/photo-1580587771525-78991c7a8c84?w=500',
    ]),
    developer_name: 'Home Builders Ltd',
    developer_phone: '+971504567890',
    developer_whatsapp: '+971504567890',
    is_featured: 0,
  },
  {
    title: 'Premium Commercial Space',
    description: 'Modern office space in business district, perfect for startups or established companies.',
    price: 5000,
    type: 'rent',
    property_type: 'commercial',
    bedrooms: null,
    bathrooms: 2,
    area: 2500,
    location: 'Business Bay',
    address: '654 Business Avenue, Dubai',
    latitude: 25.1945,
    longitude: 55.2734,
    features: JSON.stringify(['High Speed Internet', 'Meeting Rooms', 'Parking', 'Security']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
    ]),
    developer_name: 'Commercial Properties Inc',
    developer_phone: '+971505678901',
    developer_whatsapp: '+971505678901',
    is_featured: 0,
  },
  {
    title: 'Land Plot in Development Area',
    description: 'Prime land plot with potential for development, excellent investment opportunity.',
    price: 500000,
    type: 'sale',
    property_type: 'land',
    bedrooms: null,
    bathrooms: null,
    area: 5000,
    location: 'Jumeirah',
    address: '987 Development Zone, Dubai',
    latitude: 25.2706,
    longitude: 55.2411,
    features: JSON.stringify(['Accessible', 'Development Potential', 'Prime Location']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1500661311201-4c69f64c4ebb?w=500',
    ]),
    developer_name: 'Land Developers Group',
    developer_phone: '+971506789012',
    developer_whatsapp: '+971506789012',
    is_featured: 0,
  },
  {
    title: 'Elegant Penthouse',
    description: 'Top-floor luxury penthouse with panoramic views, premium finishes, and exclusive amenities.',
    price: 2500000,
    type: 'sale',
    property_type: 'apartment',
    bedrooms: 4,
    bathrooms: 4,
    area: 4000,
    location: 'Downtown Dubai',
    address: '222 Burj Boulevard, Dubai',
    latitude: 25.1972,
    longitude: 55.2744,
    features: JSON.stringify(['Gym', 'Swimming Pool', 'Concierge', 'Parking', 'Jacuzzi']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
    ]),
    developer_name: 'Luxury Residences',
    developer_phone: '+971507890123',
    developer_whatsapp: '+971507890123',
    is_featured: 1,
  },
  {
    title: 'Affordable 2-Bedroom Apartment',
    description: 'Well-maintained apartment with modern furnishings, close to schools and shopping centers.',
    price: 90000,
    type: 'rent',
    property_type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    area: 800,
    location: 'Bur Dubai',
    address: '111 Al Manara Street, Dubai',
    latitude: 25.2551,
    longitude: 55.2876,
    features: JSON.stringify(['Furnished', 'Parking', 'Near Metro']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1515516840219-0f7d76f30c1c?w=500',
    ]),
    developer_name: 'Affordable Housing Co',
    developer_phone: '+971508901234',
    developer_whatsapp: '+971508901234',
    is_featured: 0,
  },
  {
    title: 'Executive Villa with Pool',
    description: 'Premium villa with private swimming pool, home theater, and smart home automation.',
    price: 3000,
    type: 'rent',
    property_type: 'villa',
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    location: 'Emirates Hills',
    address: '555 Premium Drive, Dubai',
    latitude: 25.0906,
    longitude: 55.1706,
    features: JSON.stringify(['Swimming Pool', 'Home Theater', 'Smart Home', 'Garden', 'Security']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500',
    ]),
    developer_name: 'Premium Living',
    developer_phone: '+971509012345',
    developer_whatsapp: '+971509012345',
    is_featured: 1,
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding properties...');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      database: 'mysqrfit24_db',
    });

    for (let i = 0; i < dummyProperties.length; i++) {
      const property = dummyProperties[i];
      const id = String(i + 1);
      try {
        await connection.query(
          `INSERT INTO properties (
            id, title, description, price, type, property_type, bedrooms, bathrooms,
            area, location, address, latitude, longitude, features, images,
            developer_name, developer_phone, developer_whatsapp, is_featured, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')`,
          [
            id,
            property.title,
            property.description,
            property.price,
            property.type,
            property.property_type,
            property.bedrooms,
            property.bathrooms,
            property.area,
            property.location,
            property.address,
            property.latitude,
            property.longitude,
            property.features,
            property.images,
            property.developer_name,
            property.developer_phone,
            property.developer_whatsapp,
            property.is_featured,
          ]
        );
        console.log(`✓ Added: ${property.title}`);
      } catch (error) {
        if (!error.message.includes('Duplicate entry')) {
          console.error(`✗ Error adding ${property.title}:`, error.message);
        }
      }
    }

    console.log('✓ Database seeding completed successfully!');
    await connection.end();
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
