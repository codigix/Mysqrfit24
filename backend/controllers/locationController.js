import pool from '../config/database.js';

export const getLocations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM locations ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM locations WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

export const createLocation = async (req, res) => {
  try {
    const { name, description, image_url, lat, lng } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Location name is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO locations (name, description, image_url, lat, lng, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, description || null, image_url || null, lat || null, lng || null]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
      image_url,
      lat,
      lng,
    });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, lat, lng } = req.body;

    const [result] = await pool.query(
      'UPDATE locations SET name = ?, description = ?, image_url = ?, lat = ?, lng = ?, updated_at = NOW() WHERE id = ?',
      [name, description || null, image_url || null, lat || null, lng || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM locations WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
};
