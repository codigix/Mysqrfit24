import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { getFullUrl, deleteFileByRelativePath } from '../utils/fileUpload.js';

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
        
        images = images.map(img => getFullUrl(img));
        
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
    
    images = images.map(img => getFullUrl(img));
    
    property.features = features;
    property.images = images;

    const [reviews] = await connection.query('SELECT * FROM property_reviews WHERE property_id = ?', [id]);
    
    // Add default reviews if none exist
    if (reviews.length === 0) {
      property.reviews = [
        {
          id: 'def-1',
          author: 'Rahul Sharma',
          rating: 5,
          comment: 'Excellent property with great amenities. The location is perfect for families.',
          date: new Date().toISOString()
        },
        {
          id: 'def-2',
          author: 'Priya Patel',
          rating: 4,
          comment: 'Very spacious and well-maintained. The developer was very helpful throughout the process.',
          date: new Date().toISOString()
        }
      ];
    } else {
      property.reviews = reviews;
    }

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
      min_price,
      max_price,
      price,
      type,
      property_type,
      bedrooms,
      bathrooms,
      area,
      plot_area,
      location,
      address,
      latitude,
      longitude,
      facing,
      flooring,
      parking,
      age,
      furnishing,
      features,
      images,
      developer_name,
      developer_email,
      developer_phone,
      developer_whatsapp,
      virtual_walkthrough_url,
      video_tour_url,
      map_virtual_tour_url,
      is_featured,
      lease_amount,
      lease_duration,
      lease_deposit,
    } = req.body;

    if (!title || price === undefined || !type || !property_type || !location || !address || !developer_name || !developer_phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const propertyId = uuidv4();

    const parseNumeric = (val) => {
      if (val === undefined || val === '' || val === null) return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    };

    const connection = await pool.getConnection();
    try {
      const minPriceValue = parseNumeric(min_price);
      const maxPriceValue = parseNumeric(max_price);
      const priceValue = parseNumeric(price) || minPriceValue || 0;

      await connection.query(
        `INSERT INTO properties (
          id, title, description, min_price, max_price, price, type, property_type, bedrooms, bathrooms,
          area, plot_area, location, address, latitude, longitude, facing, flooring,
          parking, age, furnishing, features, images,
          developer_name, developer_email, developer_phone, developer_whatsapp, virtual_walkthrough_url,
          video_tour_url, map_virtual_tour_url, is_featured, status,
          lease_amount, lease_duration, lease_deposit
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', ?, ?, ?)`,
        [
          propertyId,
          title,
          description || null,
          minPriceValue,
          maxPriceValue,
          priceValue,
          type,
          property_type,
          parseNumeric(bedrooms),
          parseNumeric(bathrooms),
          parseNumeric(area),
          parseNumeric(plot_area),
          location,
          address,
          parseNumeric(latitude),
          parseNumeric(longitude),
          facing || null,
          flooring || null,
          parseNumeric(parking),
          parseNumeric(age),
          furnishing || 'unfurnished',
          features ? (typeof features === 'string' ? features : JSON.stringify(features)) : '[]',
          images ? (typeof images === 'string' ? images : JSON.stringify(images)) : '[]',
          developer_name,
          developer_email || null,
          developer_phone,
          developer_whatsapp || null,
          virtual_walkthrough_url || null,
          video_tour_url || null,
          map_virtual_tour_url || null,
          is_featured ? 1 : 0,
          parseNumeric(lease_amount),
          lease_duration || null,
          parseNumeric(lease_deposit),
        ]
      );

      const [rows] = await connection.query('SELECT * FROM properties WHERE id = ?', [propertyId]);
      connection.release();

      if (rows.length === 0) {
        return res.status(500).json({ error: 'Failed to retrieve created property' });
      }

      const property = rows[0];
      
      // Parse JSON fields if they are strings
      if (property.features && typeof property.features === 'string') {
        try { property.features = JSON.parse(property.features); } catch (e) { property.features = []; }
      }
      if (property.images && typeof property.images === 'string') {
        try { property.images = JSON.parse(property.images); } catch (e) { property.images = []; }
      }

      if (Array.isArray(property.images)) {
        property.images = property.images.map(img => getFullUrl(img));
      }

      res.status(201).json(property);
    } catch (dbError) {
      connection.release();
      console.error('Database Insert Error:', dbError);
      return res.status(500).json({ 
        error: 'Database error during property creation',
        details: dbError.message 
      });
    }
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ error: 'Internal server error during property creation' });
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

    const jsonFields = ['features', 'images'];
    const numericFields = ['price', 'min_price', 'max_price', 'bedrooms', 'bathrooms', 'area', 'plot_area', 'latitude', 'longitude', 'parking', 'age', 'lease_amount', 'lease_deposit'];

    const parseNumeric = (val) => {
      if (val === undefined || val === '' || val === null) return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    };

    for (const [key, value] of Object.entries(updates)) {
      if (key === 'images' && value !== undefined) {
        // Handle image cleanup for properties (array of images)
        let oldImages = [];
        try {
          oldImages = typeof existing[0].images === 'string' ? JSON.parse(existing[0].images) : existing[0].images;
        } catch (e) {
          oldImages = typeof existing[0].images === 'string' ? existing[0].images.split(',').map(i => i.trim()).filter(i => i) : [];
        }

        let newImages = [];
        try {
          newImages = typeof value === 'string' ? JSON.parse(value) : value;
        } catch (e) {
          newImages = Array.isArray(value) ? value : [];
        }

        if (Array.isArray(oldImages) && Array.isArray(newImages)) {
          // Find images that were in oldImages but NOT in newImages
          const removedImages = oldImages.filter(img => !newImages.includes(img));
          removedImages.forEach(img => deleteFileByRelativePath(img));
        }

        setClause.push(`${key} = ?`);
        values.push(value ? (typeof value === 'string' ? value : JSON.stringify(value)) : '[]');
      } else if (jsonFields.includes(key)) {
        setClause.push(`${key} = ?`);
        values.push(value ? (typeof value === 'string' ? value : JSON.stringify(value)) : '[]');
      } else if (numericFields.includes(key)) {
        setClause.push(`${key} = ?`);
        values.push(parseNumeric(value));
      } else if (key === 'is_featured') {
        setClause.push(`${key} = ?`);
        values.push(value ? 1 : 0);
      } else if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        setClause.push(`${key} = ?`);
        values.push(value !== undefined && value !== '' ? value : null);
      }
    }

    if (setClause.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No fields to update' });
    }

    setClause.push('updated_at = NOW()');
    values.push(id);

    try {
      await connection.query(
        `UPDATE properties SET ${setClause.join(', ')} WHERE id = ?`,
        values
      );

      const [rows] = await connection.query('SELECT * FROM properties WHERE id = ?', [id]);
      connection.release();

      if (rows.length === 0) {
        return res.status(500).json({ error: 'Failed to retrieve updated property' });
      }

      const property = rows[0];
      
      // Parse JSON fields if they are strings
      if (property.features && typeof property.features === 'string') {
        try { property.features = JSON.parse(property.features); } catch (e) { property.features = []; }
      }
      if (property.images && typeof property.images === 'string') {
        try { property.images = JSON.parse(property.images); } catch (e) { property.images = []; }
      }

      if (Array.isArray(property.images)) {
        property.images = property.images.map(img => getFullUrl(img));
      }

      res.json(property);
    } catch (dbError) {
      connection.release();
      console.error('Database Update Error:', dbError);
      return res.status(500).json({ 
        error: 'Database error during property update',
        details: dbError.message 
      });
    }
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: 'Internal server error during property update' });
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

    const property = existing[0];
    if (property.images) {
      let images = [];
      try {
        images = typeof property.images === 'string' ? JSON.parse(property.images) : property.images;
      } catch (e) {
        images = typeof property.images === 'string' ? property.images.split(',').map(i => i.trim()).filter(i => i) : [];
      }
      
      if (Array.isArray(images)) {
        images.forEach(img => deleteFileByRelativePath(img));
      }
    }

    await connection.query('DELETE FROM properties WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};

export const getSimilarProperties = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    // 1. Get current property details
    const [currentProperties] = await connection.query('SELECT * FROM properties WHERE id = ?', [id]);
    
    let current = null;
    let type = '';
    let property_type = '';
    let location = '';
    let price = 0;

    if (currentProperties.length > 0) {
      current = currentProperties[0];
      type = current.type;
      property_type = current.property_type;
      location = current.location || '';
      price = current.price || 0;
    }

    // 2. Build query for similar properties
    // We'll use a UNION-like approach or just multiple fallback queries to ensure results
    let similar = [];

    // Try finding properties in the same location and same type
    if (location || property_type) {
      let query = `
        SELECT * FROM properties 
        WHERE id != ? 
        AND status = "available"
        AND (location LIKE ? OR property_type = ?)
        LIMIT 6
      `;
      const [rows] = await connection.query(query, [id, `%${location}%`, property_type]);
      similar = rows;
    }

    // 3. Fallback to Pune properties if we don't have enough
    if (similar.length < 3) {
      const [puneRows] = await connection.query(
        'SELECT * FROM properties WHERE id != ? AND status = "available" AND (location LIKE ? OR location LIKE ?) LIMIT 6',
        [id, '%Pune%', '%pune%']
      );
      const foundIds = new Set(similar.map(p => p.id));
      const filteredPune = puneRows.filter(p => !foundIds.has(p.id));
      similar = [...similar, ...filteredPune];
    }

    // 4. Final Fallback to any available properties
    if (similar.length < 3) {
      const [anyRows] = await connection.query(
        'SELECT * FROM properties WHERE id != ? AND status = "available" ORDER BY is_featured DESC LIMIT 10',
        [id]
      );
      const foundIds = new Set(similar.map(p => p.id));
      const filteredAny = anyRows.filter(p => !foundIds.has(p.id));
      similar = [...similar, ...filteredAny];
    }

    connection.release();

    // Deduplicate just in case
    const uniqueSimilar = Array.from(new Map(similar.map(item => [item.id, item])).values()).slice(0, 6);

    const formattedSimilar = uniqueSimilar.map(prop => {
      let features = [];
      let images = [];
      
      try {
        if (prop.features) {
          features = typeof prop.features === 'string' ? JSON.parse(prop.features) : prop.features;
        }
        if (prop.images) {
          images = typeof prop.images === 'string' ? JSON.parse(prop.images) : prop.images;
        }
      } catch (e) {
        if (typeof prop.features === 'string') features = prop.features.split(',').map(f => f.trim()).filter(f => f);
        if (typeof prop.images === 'string') images = prop.images.split(',').map(i => i.trim()).filter(i => i);
      }

      return {
        ...prop,
        features: Array.isArray(features) ? features : [],
        images: Array.isArray(images) ? images : [],
      };
    });

    res.json(formattedSimilar);
  } catch (error) {
    console.error('Get similar properties error:', error);
    res.status(500).json({ error: 'Failed to fetch similar properties' });
  }
};
