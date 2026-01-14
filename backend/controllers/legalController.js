import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

export const getLegalContent = async (req, res) => {
  try {
    const { type } = req.query;

    const connection = await pool.getConnection();
    let query = 'SELECT * FROM legal_content';
    const params = [];

    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }

    const [content] = await connection.query(query, params);
    connection.release();

    res.json(content);
  } catch (error) {
    console.error('Get legal content error:', error);
    res.status(500).json({ error: 'Failed to fetch legal content' });
  }
};

export const getLegalContentById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [content] = await connection.query('SELECT * FROM legal_content WHERE id = ?', [id]);
    connection.release();

    if (content.length === 0) {
      return res.status(404).json({ error: 'Legal content not found' });
    }

    res.json(content[0]);
  } catch (error) {
    console.error('Get legal content by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch legal content' });
  }
};

export const createLegalContent = async (req, res) => {
  try {
    const { type, title, content, is_published } = req.body;
    const userId = req.user.id;

    if (!type || !title || !content) {
      return res.status(400).json({ error: 'Type, title, and content are required' });
    }

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT id FROM legal_content WHERE type = ?', [type]);
    
    if (existing.length > 0) {
      connection.release();
      return res.status(409).json({ error: 'Legal content of this type already exists' });
    }

    const id = uuidv4();
    await connection.query(
      'INSERT INTO legal_content (id, type, title, content, is_published, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
      [id, type, title, content, is_published !== undefined ? is_published : true, userId]
    );
    connection.release();

    res.status(201).json({ id, type, title, content, is_published });
  } catch (error) {
    console.error('Create legal content error:', error);
    res.status(500).json({ error: 'Failed to create legal content' });
  }
};

export const updateLegalContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, is_published } = req.body;
    const userId = req.user.id;

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT * FROM legal_content WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Legal content not found' });
    }

    await connection.query(
      'UPDATE legal_content SET title = ?, content = ?, is_published = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title || existing[0].title, content || existing[0].content, is_published !== undefined ? is_published : existing[0].is_published, userId, id]
    );

    connection.release();

    res.json({ id, ...existing[0], title: title || existing[0].title, content: content || existing[0].content });
  } catch (error) {
    console.error('Update legal content error:', error);
    res.status(500).json({ error: 'Failed to update legal content' });
  }
};

export const deleteLegalContent = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT * FROM legal_content WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Legal content not found' });
    }

    await connection.query('DELETE FROM legal_content WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Legal content deleted successfully' });
  } catch (error) {
    console.error('Delete legal content error:', error);
    res.status(500).json({ error: 'Failed to delete legal content' });
  }
};
