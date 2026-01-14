import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const getBlogPosts = async (req, res) => {
  try {
    const { status, category, published_only } = req.query;

    let query = 'SELECT * FROM blog_posts WHERE 1=1';
    const params = [];

    if (published_only === 'true' || status === 'published') {
      query += ' AND status = ?';
      params.push('published');
    } else if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const connection = await pool.getConnection();
    const [posts] = await connection.query(query, params);
    connection.release();

    res.json(posts);
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
};

export const getBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [posts] = await connection.query('SELECT * FROM blog_posts WHERE id = ?', [id]);

    if (posts.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const post = posts[0];

    // Increment views
    await connection.query('UPDATE blog_posts SET views = views + 1 WHERE id = ?', [id]);
    connection.release();

    post.views += 1;
    res.json(post);
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
};

export const getBlogPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const connection = await pool.getConnection();
    const [posts] = await connection.query('SELECT * FROM blog_posts WHERE slug = ?', [slug]);

    if (posts.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const post = posts[0];

    // Increment views
    await connection.query('UPDATE blog_posts SET views = views + 1 WHERE id = ?', [post.id]);
    connection.release();

    post.views += 1;
    res.json(post);
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
};

export const createBlogPost = async (req, res) => {
  try {
    const { title, content, excerpt, image_url, author, category, status } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Title, content, and author are required' });
    }

    const postId = uuidv4();
    const slug = slugify(title);

    const connection = await pool.getConnection();
    
    // Check if slug already exists
    const [existing] = await connection.query('SELECT id FROM blog_posts WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'A post with this title already exists' });
    }

    const publishedAt = status === 'published' ? new Date() : null;

    await connection.query(
      `INSERT INTO blog_posts (id, title, slug, content, excerpt, image_url, author, category, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [postId, title, slug, content, excerpt || null, image_url || null, author, category || null, status || 'draft', publishedAt]
    );
    connection.release();

    res.status(201).json({ id: postId, slug, message: 'Blog post created successfully' });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
};

export const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, image_url, author, category, status } = req.body;

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT * FROM blog_posts WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Blog post not found' });
    }

    let slug = existing[0].slug;
    if (title && title !== existing[0].title) {
      slug = slugify(title);
      
      const [slugExists] = await connection.query('SELECT id FROM blog_posts WHERE slug = ? AND id != ?', [slug, id]);
      if (slugExists.length > 0) {
        connection.release();
        return res.status(400).json({ error: 'A post with this title already exists' });
      }
    }

    const setClause = [];
    const values = [];

    if (title) {
      setClause.push('title = ?');
      values.push(title);
      setClause.push('slug = ?');
      values.push(slug);
    }
    if (content) {
      setClause.push('content = ?');
      values.push(content);
    }
    if (excerpt !== undefined) {
      setClause.push('excerpt = ?');
      values.push(excerpt || null);
    }
    if (image_url !== undefined) {
      setClause.push('image_url = ?');
      values.push(image_url || null);
    }
    if (author) {
      setClause.push('author = ?');
      values.push(author);
    }
    if (category !== undefined) {
      setClause.push('category = ?');
      values.push(category || null);
    }
    if (status) {
      setClause.push('status = ?');
      values.push(status);
      
      if (status === 'published' && !existing[0].published_at) {
        setClause.push('published_at = NOW()');
      }
    }

    setClause.push('updated_at = NOW()');
    values.push(id);

    await connection.query(
      `UPDATE blog_posts SET ${setClause.join(', ')} WHERE id = ?`,
      values
    );

    connection.release();

    res.json({ message: 'Blog post updated successfully' });
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
};

export const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT * FROM blog_posts WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Blog post not found' });
    }

    await connection.query('DELETE FROM blog_posts WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
};
