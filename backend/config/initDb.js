import pool from './database.js';

export const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // List of columns to check and add if missing
    const columnsToAdd = [
      { name: 'plot_area', type: 'DECIMAL(10, 2)', after: 'area' },
      { name: 'facing', type: 'VARCHAR(50)', after: 'longitude' },
      { name: 'flooring', type: 'VARCHAR(100)', after: 'facing' },
      { name: 'parking', type: 'INT', after: 'flooring' },
      { name: 'age', type: 'INT', after: 'parking' },
      { name: 'furnishing', type: "ENUM('unfurnished', 'semi-furnished', 'furnished') DEFAULT 'unfurnished'", after: 'age' },
      { name: 'developer_email', type: 'VARCHAR(255)', after: 'developer_name' },
      { name: 'developer_whatsapp', type: 'VARCHAR(20)', after: 'developer_phone' },
      { name: 'virtual_walkthrough_url', type: 'VARCHAR(500)', after: 'developer_whatsapp' },
      { name: 'video_tour_url', type: 'VARCHAR(500)', after: 'virtual_walkthrough_url' },
      { name: 'map_virtual_tour_url', type: 'VARCHAR(500)', after: 'video_tour_url' }
    ];

    for (const col of columnsToAdd) {
      try {
        // Check if column exists
        const [existing] = await connection.query(
          `SHOW COLUMNS FROM properties LIKE ?`,
          [col.name]
        );

        if (existing.length === 0) {
          // Add column if it doesn't exist
          // We use a safer way without 'AFTER' if the 'AFTER' column might be missing
          // But here we try with 'AFTER' first, then without if it fails
          try {
            await connection.query(`ALTER TABLE properties ADD COLUMN ${col.name} ${col.type} AFTER ${col.after}`);
            console.log(`✓ Added column ${col.name}`);
          } catch (afterError) {
            await connection.query(`ALTER TABLE properties ADD COLUMN ${col.name} ${col.type}`);
            console.log(`✓ Added column ${col.name} (at the end)`);
          }
        }
      } catch (colError) {
        console.error(`Error handling column ${col.name}:`, colError.message);
      }
    }

    // Modify existing columns if needed
    try {
      await connection.query(`
        ALTER TABLE properties 
        MODIFY COLUMN type ENUM('sale', 'rent', 'lease') NOT NULL
      `);
      console.log('✓ Modified type column');
    } catch (error) {
      console.error('Error modifying type column:', error.message);
    }

    try {
      await connection.query(`
        ALTER TABLE properties 
        MODIFY COLUMN property_type ENUM('apartment', 'house', 'villa', 'commercial', 'land', 'flats', 'rowhouses', 'godowns', 'shops', 'openland') NOT NULL
      `);
      console.log('✓ Modified property_type column');
    } catch (error) {
      console.error('Error modifying property_type column:', error.message);
    }
    
    connection.release();
    console.log('✓ Database initialization completed');
  } catch (error) {
    console.error('Database initialization error:', error.message);
    throw error;
  }
};
