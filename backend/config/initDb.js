import pool from './database.js';

export const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.query(`
        ALTER TABLE properties 
        ADD COLUMN virtual_walkthrough_url VARCHAR(500) AFTER developer_whatsapp
      `);
      console.log('Added virtual_walkthrough_url column');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error;
      }
    }
    
    try {
      await connection.query(`
        ALTER TABLE properties 
        ADD COLUMN map_virtual_tour_url VARCHAR(500) AFTER virtual_walkthrough_url
      `);
      console.log('Added map_virtual_tour_url column');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error;
      }
    }
    
    connection.release();
    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error.message);
    throw error;
  }
};
