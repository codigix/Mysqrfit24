import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message, property_id } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const messageId = uuidv4();

    const connection = await pool.getConnection();
    
    // Verify property exists if property_id provided
    if (property_id) {
      const [property] = await connection.query('SELECT id FROM properties WHERE id = ?', [property_id]);
      if (property.length === 0) {
        connection.release();
        return res.status(400).json({ error: 'Property not found' });
      }
    }

    await connection.query(
      `INSERT INTO contact_messages (id, name, email, phone, subject, message, property_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`,
      [messageId, name, email, phone || null, subject || null, message, property_id || null]
    );
    connection.release();

    res.status(201).json({ id: messageId, message: 'Contact message sent successfully' });
  } catch (error) {
    console.error('Create contact message error:', error);
    res.status(500).json({ error: 'Failed to send contact message' });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const { status, property_id } = req.query;

    let query = 'SELECT * FROM contact_messages WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (property_id) {
      query += ' AND property_id = ?';
      params.push(property_id);
    }

    query += ' ORDER BY created_at DESC';

    const connection = await pool.getConnection();
    const [messages] = await connection.query(query, params);
    connection.release();

    res.json(messages);
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
};

export const getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [messages] = await connection.query('SELECT * FROM contact_messages WHERE id = ?', [id]);

    if (messages.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Message not found' });
    }

    const message = messages[0];

    // Mark as read
    if (message.status === 'new') {
      await connection.query('UPDATE contact_messages SET status = ? WHERE id = ?', ['read', id]);
      message.status = 'read';
    }

    connection.release();

    res.json(message);
  } catch (error) {
    console.error('Get contact message error:', error);
    res.status(500).json({ error: 'Failed to fetch contact message' });
  }
};

export const updateContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required (new, read, replied)' });
    }

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT id FROM contact_messages WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Message not found' });
    }

    await connection.query('UPDATE contact_messages SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    connection.release();

    res.json({ message: 'Message status updated successfully' });
  } catch (error) {
    console.error('Update contact message error:', error);
    res.status(500).json({ error: 'Failed to update contact message' });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT id FROM contact_messages WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Message not found' });
    }

    await connection.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({ error: 'Failed to delete contact message' });
  }
};

export const getContactStats = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [stats] = await connection.query(`
      SELECT 
        COUNT(*) as total_messages,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_messages,
        SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read_messages,
        SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied_messages
      FROM contact_messages
    `);
    
    connection.release();

    res.json(stats[0]);
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({ error: 'Failed to fetch contact stats' });
  }
};
