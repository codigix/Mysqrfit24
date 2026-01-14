import { v4 as uuidv4 } from 'uuid';
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
    
    console.log('Creating location with data:', { name, description, image_url, lat, lng });

    if (!name) {
      return res.status(400).json({ error: 'Location name is required' });
    }

    const locationId = uuidv4();

    // Ensure lat/lng are either numbers or null, not empty strings or undefined
    const latitude = (lat !== undefined && lat !== '') ? parseFloat(lat) : null;
    const longitude = (lng !== undefined && lng !== '') ? parseFloat(lng) : null;

    await pool.query(
      'INSERT INTO locations (id, name, description, image_url, lat, lng, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [locationId, name, description || null, image_url || null, latitude, longitude]
    );

    res.status(201).json({
      id: locationId,
      name,
      description,
      image_url,
      lat: latitude,
      lng: longitude,
    });
  } catch (error) {
    console.error('CRITICAL: Error creating location:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error.message,
      code: error.code 
    });
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
