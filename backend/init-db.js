import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
    });

    const sqlFilePath = path.join(__dirname, 'config', 'database.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    const statements = sql.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (err) {
          if (!err.message.includes('already exists')) {
            console.error('SQL Error:', err.message);
          }
        }
      }
    }

    console.log('✓ Database initialized successfully!');
    console.log('✓ Database: mysqrfit24_db');
    console.log('✓ Tables created:');
    console.log('  - users');
    console.log('  - properties');
    console.log('  - chatbot_inquiries');
    console.log('  - property_images');
    console.log('  - property_reviews');
    console.log('  - admin_logs');
    console.log('  - testimonials');
    console.log('  - blog_posts');
    console.log('  - team_members');
    console.log('  - newsletter_subscribers');
    console.log('  - contact_messages');
    console.log('  - legal_content');
    console.log('  - site_settings');
    console.log('  - files');
    console.log('  - locations');

    await connection.end();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

initDatabase();
