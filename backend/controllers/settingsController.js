import pool from '../config/database.js';

export const getSettings = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, setting_key, setting_value, setting_type, description, updated_at FROM site_settings ORDER BY setting_key ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM site_settings WHERE setting_key = ?',
      [key]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
};

export const createSetting = async (req, res) => {
  try {
    const { setting_key, setting_value, setting_type, description } = req.body;

    if (!setting_key || !setting_value) {
      return res.status(400).json({ error: 'Setting key and value are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO site_settings (setting_key, setting_value, setting_type, description, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [setting_key, setting_value, setting_type || 'text', description || null]
    );

    res.status(201).json({
      id: result.insertId,
      setting_key,
      setting_value,
      setting_type: setting_type || 'text',
      description,
    });
  } catch (error) {
    console.error('Error creating setting:', error);
    res.status(500).json({ error: 'Failed to create setting' });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value, setting_type, description } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM site_settings WHERE setting_key = ?',
      [key]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    const currentType = rows[0].setting_type;
    const newType = setting_type || currentType;

    const [result] = await pool.query(
      'UPDATE site_settings SET setting_value = ?, setting_type = ?, description = ?, updated_at = NOW() WHERE setting_key = ?',
      [value, newType, description !== undefined ? description : rows[0].description, key]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

export const deleteSetting = async (req, res) => {
  try {
    const { key } = req.params;

    const [result] = await pool.query(
      'DELETE FROM site_settings WHERE setting_key = ?',
      [key]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
};
