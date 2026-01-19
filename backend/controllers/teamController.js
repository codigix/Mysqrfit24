import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { getFullUrl } from '../utils/fileUpload.js';

export const getTeamMembers = async (req, res) => {
  try {
    const { active_only } = req.query;

    let query = 'SELECT * FROM team_members WHERE 1=1';
    const params = [];

    if (active_only === 'true') {
      query += ' AND is_active = ?';
      params.push(1);
    }

    query += ' ORDER BY display_order ASC, created_at ASC';

    const connection = await pool.getConnection();
    const [members] = await connection.query(query, params);
    connection.release();

    const formattedMembers = members.map(member => ({
      ...member,
      image_url: getFullUrl(member.image_url),
      social_links: member.social_links ? JSON.parse(member.social_links) : {},
    }));

    res.json(formattedMembers);
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
};

export const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [members] = await connection.query('SELECT * FROM team_members WHERE id = ?', [id]);
    connection.release();

    if (members.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    const member = members[0];
    member.image_url = getFullUrl(member.image_url);
    member.social_links = member.social_links ? JSON.parse(member.social_links) : {};

    res.json(member);
  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
};

export const createTeamMember = async (req, res) => {
  try {
    const { name, role, bio, image_url, email, phone, social_links, is_active, display_order } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: 'Name and role are required' });
    }

    const memberId = uuidv4();

    const connection = await pool.getConnection();
    await connection.query(
      `INSERT INTO team_members (id, name, role, bio, image_url, email, phone, social_links, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        memberId,
        name,
        role,
        bio || null,
        image_url || null,
        email || null,
        phone || null,
        social_links ? JSON.stringify(social_links) : '{}',
        is_active !== false ? 1 : 0,
        display_order || 0,
      ]
    );
    connection.release();

    res.status(201).json({ id: memberId, message: 'Team member created successfully' });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT * FROM team_members WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Team member not found' });
    }

    const setClause = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (key === 'social_links' && value !== undefined && value !== null) {
        setClause.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
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
      `UPDATE team_members SET ${setClause.join(', ')} WHERE id = ?`,
      values
    );

    connection.release();

    res.json({ message: 'Team member updated successfully' });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT * FROM team_members WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Team member not found' });
    }

    await connection.query('DELETE FROM team_members WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
};
