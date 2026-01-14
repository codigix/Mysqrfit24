import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const dummyLocations = [
  {
    name: 'Downtown Dubai',
    description: 'Home to the iconic Burj Khalifa and Dubai Mall, offering luxury living and world-class entertainment.',
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    lat: 25.1972,
    lng: 55.2744,
  },
  {
    name: 'Arabian Ranches',
    description: 'A premium gated community known for its Mediterranean and Arabic-themed villas and lush greenery.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    lat: 25.0631,
    lng: 55.1531,
  },
  {
    name: 'Dubai Marina',
    description: 'A vibrant waterfront community featuring luxury skyscrapers, a 7km walkway, and various dining options.',
    image_url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
    lat: 25.0819,
    lng: 55.1447,
  },
  {
    name: 'Palm Jumeirah',
    description: 'The world-famous man-made island, offering exclusive beachfront villas and luxury apartments.',
    image_url: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800',
    lat: 25.1124,
    lng: 55.1390,
  },
  {
    name: 'Business Bay',
    description: 'A major business and residential district in the heart of Dubai, known for its modern architecture.',
    image_url: 'https://images.unsplash.com/photo-1526481280693-3bfa75ac66b4?w=800',
    lat: 25.1945,
    lng: 55.2734,
  }
];

const seedLocations = async () => {
  try {
    console.log('🌱 Seeding locations...');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'mysqrfit24_db',
    });

    for (const loc of dummyLocations) {
      const id = uuidv4();
      try {
        await connection.query(
          'INSERT INTO locations (id, name, description, image_url, lat, lng, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [id, loc.name, loc.description, loc.image_url, loc.lat, loc.lng]
        );
        console.log(`✓ Added: ${loc.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
           console.log(`- Skipping ${loc.name} (already exists)`);
        } else {
          console.error(`✗ Error adding ${loc.name}:`, error.message);
        }
      }
    }

    console.log('✓ Location seeding completed successfully!');
    await connection.end();
  } catch (error) {
    console.error('❌ Location seeding failed:', error.message);
    process.exit(1);
  }
};

seedLocations();
