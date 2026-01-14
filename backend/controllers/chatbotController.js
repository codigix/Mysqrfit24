import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

export const createInquiry = async (req, res) => {
  try {
    const { property_type, budget, location, contact, name, email, phone, message } = req.body;

    if (!property_type || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const inquiryId = uuidv4();

    const connection = await pool.getConnection();
    await connection.query(
      `INSERT INTO chatbot_inquiries (
        id, property_type, budget, location, contact, name, email, phone, message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [inquiryId, property_type, budget, location, contact || null, name || null, email || null, phone || null, message || null]
    );
    connection.release();

    res.status(201).json({ id: inquiryId, message: 'Inquiry created successfully' });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ error: 'Failed to create inquiry' });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [inquiries] = await connection.query(
      'SELECT * FROM chatbot_inquiries ORDER BY created_at DESC'
    );
    connection.release();

    res.json(inquiries);
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT id FROM chatbot_inquiries WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    await connection.query('DELETE FROM chatbot_inquiries WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
};
