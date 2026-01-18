import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const migrateDatabase = async () => {
  let connection;
  try {
    console.log('🔄 Adding lease columns to properties table...');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'mysqrfit24_db',
      port: process.env.DB_PORT || 3306,
    });

    const columns = [
      { name: 'lease_amount', type: 'DECIMAL(15, 2)' },
      { name: 'lease_duration', type: 'VARCHAR(100)' },
      { name: 'lease_deposit', type: 'DECIMAL(15, 2)' },
    ];

    for (const col of columns) {
      try {
        const [rows] = await connection.query(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'properties' AND COLUMN_NAME = ?`,
          [col.name]
        );
        
        if (rows.length === 0) {
          await connection.query(`ALTER TABLE properties ADD COLUMN ${col.name} ${col.type}`);
          console.log(`✓ Added column: ${col.name}`);
        } else {
          console.log(`⚠ Column already exists: ${col.name}`);
        }
      } catch (err) {
        console.error(`✗ Error processing column ${col.name}:`, err.message);
        throw err;
      }
    }

    try {
      await connection.query(`CREATE INDEX idx_lease_amount ON properties(lease_amount)`);
      console.log(`✓ Created index: idx_lease_amount`);
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log(`⚠ Index already exists: idx_lease_amount`);
      } else {
        throw err;
      }
    }

    console.log('✓ Migration completed successfully!');
    console.log('✓ Added columns: lease_amount, lease_duration, lease_deposit');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

migrateDatabase();
