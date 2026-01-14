import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const checkDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'mysqrfit24_db',
      port: process.env.DB_PORT || 3306,
    });

    const [properties] = await connection.query('SELECT id, title, features, images FROM properties LIMIT 1');
    
    console.log('First property from database:');
    console.log(JSON.stringify(properties[0], null, 2));

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkDatabase();
