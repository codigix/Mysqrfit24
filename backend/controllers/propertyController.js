import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

export const getProperties = async (req, res) => {
  try {
    const { type, property_type, location, min_price, max_price, bedrooms, bathrooms } = req.query;

    let query = 'SELECT * FROM properties WHERE status = "available"';
    const params = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (property_type) {
      query += ' AND property_type = ?';
      params.push(property_type);
    }
    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }
    if (min_price) {
      query += ' AND price >= ?';
      params.push(parseFloat(min_price));
    }
    if (max_price) {
      query += ' AND price <= ?';
      params.push(parseFloat(max_price));
    }
    if (bedrooms) {
      query += ' AND bedrooms = ?';
      params.push(parseInt(bedrooms));
    }
    if (bathrooms) {
      query += ' AND bathrooms = ?';
      params.push(parseInt(bathrooms));
    }

    query += ' ORDER BY is_featured DESC, created_at DESC';

    const connection = await pool.getConnection();
    const [properties] = await connection.query(query, params);
    connection.release();

    const formattedProperties = properties.map(prop => {
      try {
        let features = [];
        let images = [];
        
        if (prop.features) {
          if (Array.isArray(prop.features)) {
            features = prop.features;
          } else {
            try {
              features = JSON.parse(prop.features);
            } catch {
              features = prop.features.split(',').map(f => f.trim()).filter(f => f);
            }
          }
        }
        
        if (prop.images) {
          if (Array.isArray(prop.images)) {
            images = prop.images;
          } else {
            try {
              images = JSON.parse(prop.images);
            } catch {
              images = prop.images.split(',').map(i => i.trim()).filter(i => i);
            }
          }
        }
        
        return {
          ...prop,
          features,
          images,
        };
      } catch (parseError) {
        console.error('Error parsing property data:', parseError, prop);
        return {
          ...prop,
          features: [],
          images: [],
        };
      }
    });

    res.json(formattedProperties);
  } catch (error) {
    console.error('Get properties error:', error.message, error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [properties] = await connection.query('SELECT * FROM properties WHERE id = ?', [id]);

    if (properties.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = properties[0];
    
    let features = [];
    let images = [];
    
    if (property.features) {
      if (Array.isArray(property.features)) {
        features = property.features;
      } else {
        try {
          features = JSON.parse(property.features);
        } catch {
          features = property.features.split(',').map(f => f.trim()).filter(f => f);
        }
      }
    }
    
    if (property.images) {
      if (Array.isArray(property.images)) {
        images = property.images;
      } else {
        try {
          images = JSON.parse(property.images);
        } catch {
          images = property.images.split(',').map(i => i.trim()).filter(i => i);
        }
      }
    }
    
    property.features = features;
    property.images = images;

    const [reviews] = await connection.query('SELECT * FROM property_reviews WHERE property_id = ?', [id]);
    property.reviews = reviews;

    connection.release();

    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};

export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      type,
      property_type,
      bedrooms,
      bathrooms,
      area,
      location,
      address,
      latitude,
      longitude,
      features,
      images,
      developer_name,
      developer_phone,
      developer_whatsapp,
      virtual_walkthrough_url,
      map_virtual_tour_url,
      is_featured,
    } = req.body;

    if (!title || !price || !type || !property_type || !location || !address || !developer_name || !developer_phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const propertyId = uuidv4();

    const connection = await pool.getConnection();
    await connection.query(
      `INSERT INTO properties (
        id, title, description, price, type, property_type, bedrooms, bathrooms,
        area, location, address, latitude, longitude, features, images,
        developer_name, developer_phone, developer_whatsapp, virtual_walkthrough_url,
        map_virtual_tour_url, is_featured, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')`,
      [
        propertyId,
        title,
        description,
        price,
        type,
        property_type,
        bedrooms || null,
        bathrooms || null,
        area,
        location,
        address,
        latitude || null,
        longitude || null,
        features ? JSON.stringify(features) : '[]',
        images ? JSON.stringify(images) : '[]',
        developer_name,
        developer_phone,
        developer_whatsapp || null,
        virtual_walkthrough_url || null,
        map_virtual_tour_url || null,
        is_featured ? 1 : 0,
      ]
    );
    connection.release();

    const [newProperty] = await pool.getConnection().then(conn =>
      conn.query('SELECT * FROM properties WHERE id = ?', [propertyId]).then(result => {
        conn.release();
        return result;
      })
    );

    if (newProperty.length > 0) {
      let features = [];
      let images = [];
      
      if (newProperty[0].features) {
        if (Array.isArray(newProperty[0].features)) {
          features = newProperty[0].features;
        } else {
          try {
            features = JSON.parse(newProperty[0].features);
          } catch {
            features = newProperty[0].features.split(',').map(f => f.trim()).filter(f => f);
          }
        }
      }
      
      if (newProperty[0].images) {
        if (Array.isArray(newProperty[0].images)) {
          images = newProperty[0].images;
        } else {
          try {
            images = JSON.parse(newProperty[0].images);
          } catch {
            images = newProperty[0].images.split(',').map(i => i.trim()).filter(i => i);
          }
        }
      }
      
      newProperty[0].features = features;
      newProperty[0].images = images;
      res.status(201).json(newProperty[0]);
    }
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT * FROM properties WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Property not found' });
    }

    const setClause = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (['features', 'images'].includes(key)) {
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
      `UPDATE properties SET ${setClause.join(', ')} WHERE id = ?`,
      values
    );

    const [updated] = await connection.query('SELECT * FROM properties WHERE id = ?', [id]);
    connection.release();

    if (updated.length > 0) {
      let features = [];
      let images = [];
      
      if (updated[0].features) {
        if (Array.isArray(updated[0].features)) {
          features = updated[0].features;
        } else {
          try {
            features = JSON.parse(updated[0].features);
          } catch {
            features = updated[0].features.split(',').map(f => f.trim()).filter(f => f);
          }
        }
      }
      
      if (updated[0].images) {
        if (Array.isArray(updated[0].images)) {
          images = updated[0].images;
        } else {
          try {
            images = JSON.parse(updated[0].images);
          } catch {
            images = updated[0].images.split(',').map(i => i.trim()).filter(i => i);
          }
        }
      }
      
      updated[0].features = features;
      updated[0].images = images;
      res.json(updated[0]);
    }
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    
    const [existing] = await connection.query('SELECT * FROM properties WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Property not found' });
    }

    await connection.query('DELETE FROM properties WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};
