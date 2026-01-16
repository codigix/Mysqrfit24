import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const seedAdmin = async () => {
  try {
    console.log('👤 Seeding admin user...');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'mysqrfit24_db',
    });

    const email = process.env.ADMIN_EMAIL || 'admin@mysqrfit24.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';

    const [existingUsers] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      console.log('ℹ️ Admin user already exists.');
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const id = uuidv4();
      
      await connection.query(
        'INSERT INTO users (id, email, password_hash, is_admin, role) VALUES (?, ?, ?, TRUE, "admin")',
        [id, email, hashedPassword]
      );
      
      console.log(`✓ Admin user created: ${email}`);
    }

    await connection.end();
    console.log('✓ Admin seeding completed successfully!');
  } catch (error) {
    console.error('❌ Admin seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
