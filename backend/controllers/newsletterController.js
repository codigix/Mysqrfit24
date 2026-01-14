import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

export const subscribeToNewsletter = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const subscriberId = uuidv4();

    const connection = await pool.getConnection();
    
    // Check if already subscribed
    const [existing] = await connection.query('SELECT id FROM newsletter_subscribers WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      // Update to resubscribe if unsubscribed
      await connection.query('UPDATE newsletter_subscribers SET is_subscribed = 1, updated_at = NOW() WHERE email = ?', [email]);
      connection.release();
      return res.json({ message: 'Successfully subscribed to newsletter' });
    }

    await connection.query(
      `INSERT INTO newsletter_subscribers (id, email, name, is_subscribed)
       VALUES (?, ?, ?, 1)`,
      [subscriberId, email, name || null]
    );
    connection.release();

    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Subscribe to newsletter error:', error);
    res.status(500).json({ error: 'Failed to subscribe to newsletter' });
  }
};

export const unsubscribeFromNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT id FROM newsletter_subscribers WHERE email = ?', [email]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Email not found' });
    }

    await connection.query('UPDATE newsletter_subscribers SET is_subscribed = 0 WHERE email = ?', [email]);
    connection.release();

    res.json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    console.error('Unsubscribe from newsletter error:', error);
    res.status(500).json({ error: 'Failed to unsubscribe from newsletter' });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const { subscribed_only } = req.query;

    let query = 'SELECT id, email, name, is_subscribed, subscription_date, created_at FROM newsletter_subscribers WHERE 1=1';
    const params = [];

    if (subscribed_only === 'true') {
      query += ' AND is_subscribed = ?';
      params.push(1);
    }

    query += ' ORDER BY subscription_date DESC';

    const connection = await pool.getConnection();
    const [subscribers] = await connection.query(query, params);
    connection.release();

    res.json(subscribers);
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
};

export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT id FROM newsletter_subscribers WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    await connection.query('DELETE FROM newsletter_subscribers WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ error: 'Failed to delete subscriber' });
  }
};
