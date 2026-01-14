import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

export const getTestimonials = async (req, res) => {
  try {
    const { published_only, featured_only } = req.query;

    let query = 'SELECT * FROM testimonials WHERE 1=1';
    const params = [];

    if (published_only === 'true') {
      query += ' AND status = ?';
      params.push('published');
    }

    if (featured_only === 'true') {
      query += ' AND is_featured = ?';
      params.push(1);
    }

    query += ' ORDER BY is_featured DESC, created_at DESC';

    const connection = await pool.getConnection();
    const [testimonials] = await connection.query(query, params);
    connection.release();

    res.json(testimonials);
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

export const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [testimonials] = await connection.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    connection.release();

    if (testimonials.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(testimonials[0]);
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { name, role, content, rating, image_url, is_featured, status } = req.body;

    if (!name || !content) {
      return res.status(400).json({ error: 'Name and content are required' });
    }

    const testimonialId = uuidv4();

    const connection = await pool.getConnection();
    await connection.query(
      `INSERT INTO testimonials (id, name, role, content, rating, image_url, is_featured, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [testimonialId, name, role || null, content, rating || 5, image_url || null, is_featured ? 1 : 0, status || 'published']
    );
    connection.release();

    res.status(201).json({ id: testimonialId, message: 'Testimonial created successfully' });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    const setClause = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && value !== null) {
        setClause.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (setClause.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    setClause.push('updated_at = NOW()');
    values.push(id);

    await connection.query(
      `UPDATE testimonials SET ${setClause.join(', ')} WHERE id = ?`,
      values
    );

    connection.release();

    res.json({ message: 'Testimonial updated successfully' });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    await connection.query('DELETE FROM testimonials WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};
