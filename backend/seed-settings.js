import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const defaultSettings = [
  {
    key: 'hero_title',
    value: "The Finest Napa's\nReal Estate Properties",
    type: 'text',
    description: 'Main title displayed on the home page hero section'
  },
  {
    key: 'stats_sold_homes',
    value: '7,000+',
    type: 'text',
    description: 'Number of homes sold displayed in stats section'
  },
  {
    key: 'stats_sales_volume',
    value: '$1B+',
    type: 'text',
    description: 'Total sales volume displayed in stats section'
  },
  {
    key: 'stats_satisfied_customers',
    value: '1,000+',
    type: 'text',
    description: 'Number of satisfied customers displayed in stats section'
  },
  {
    key: 'site_name',
    value: 'MySqrfit',
    type: 'text',
    description: 'The name of the website'
  },
  {
    key: 'contact_email',
    value: 'contact@mysqrfit.com',
    type: 'text',
    description: 'Main contact email address'
  },
  {
    key: 'phone_number',
    value: '+1 (555) 123-4567',
    type: 'text',
    description: 'Main contact phone number'
  }
];

const seedSettings = async () => {
  try {
    console.log('⚙️ Seeding site settings...');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'mysqrfit24_db',
    });

    for (const setting of defaultSettings) {
      const [existing] = await connection.query(
        'SELECT id FROM site_settings WHERE setting_key = ?',
        [setting.key]
      );

      if (existing.length === 0) {
        await connection.query(
          'INSERT INTO site_settings (id, setting_key, setting_value, setting_type, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
          [uuidv4(), setting.key, setting.value, setting.type, setting.description]
        );
        console.log(`✓ Added setting: ${setting.key}`);
      } else {
        console.log(`ℹ️ Setting already exists: ${setting.key}`);
      }
    }

    await connection.end();
    console.log('✓ Settings seeding completed successfully!');
  } catch (error) {
    console.error('❌ Settings seeding failed:', error.message);
    process.exit(1);
  }
};

seedSettings();
