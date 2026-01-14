import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const clearProperties = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'mysqrfit24_db',
      port: process.env.DB_PORT || 3306,
    });

    await connection.query('DELETE FROM properties');
    await connection.end();
    console.log('✓ Properties cleared');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

clearProperties();
