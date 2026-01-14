CREATE DATABASE IF NOT EXISTS mysqrfit24_db;
USE mysqrfit24_db;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role ENUM('admin', 'user') DEFAULT 'user',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

CREATE TABLE IF NOT EXISTS properties (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  price DECIMAL(15, 2) NOT NULL,
  type ENUM('sale', 'rent') NOT NULL,
  property_type ENUM('apartment', 'house', 'villa', 'commercial', 'land') NOT NULL,
  bedrooms INT,
  bathrooms INT,
  area DECIMAL(10, 2),
  location VARCHAR(255),
  address VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  features JSON,
  images JSON,
  developer_name VARCHAR(255),
  developer_phone VARCHAR(20),
  developer_whatsapp VARCHAR(20),
  virtual_walkthrough_url VARCHAR(500),
  map_virtual_tour_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT FALSE,
  status ENUM('available', 'sold', 'rented') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_property_type (property_type),
  INDEX idx_location (location),
  INDEX idx_status (status),
  INDEX idx_price (price),
  INDEX idx_created_at (created_at),
  FULLTEXT INDEX ft_title_description (title, description)
);

CREATE TABLE IF NOT EXISTS chatbot_inquiries (
  id VARCHAR(36) PRIMARY KEY,
  property_type ENUM('rent', 'buy') NOT NULL,
  budget VARCHAR(100),
  location VARCHAR(255),
  contact VARCHAR(255),
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  message LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at),
  INDEX idx_location (location)
);

CREATE TABLE IF NOT EXISTS property_images (
  id VARCHAR(36) PRIMARY KEY,
  property_id VARCHAR(36) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_property_id (property_id)
);

CREATE TABLE IF NOT EXISTS property_reviews (
  id VARCHAR(36) PRIMARY KEY,
  property_id VARCHAR(36) NOT NULL,
  author VARCHAR(255),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_property_id (property_id),
  INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS admin_logs (
  id VARCHAR(36) PRIMARY KEY,
  admin_id VARCHAR(36),
  action VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id VARCHAR(36),
  changes JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_created_at (created_at),
  INDEX idx_admin_id (admin_id)
);

CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  content LONGTEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  image_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT FALSE,
  status ENUM('published', 'draft') DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_is_featured (is_featured),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt LONGTEXT,
  content LONGTEXT NOT NULL,
  image_url VARCHAR(500),
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  status ENUM('published', 'draft') DEFAULT 'draft',
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_created_at (created_at),
  INDEX idx_published_at (published_at),
  FULLTEXT INDEX ft_title_content (title, content)
);

CREATE TABLE IF NOT EXISTS team_members (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio LONGTEXT,
  image_url VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(20),
  social_links JSON,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_is_active (is_active),
  INDEX idx_display_order (display_order)
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_subscribed BOOLEAN DEFAULT TRUE,
  subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_is_subscribed (is_subscribed)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(500),
  message LONGTEXT NOT NULL,
  property_id VARCHAR(36),
  status ENUM('new', 'read', 'replied') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_property_id (property_id)
);

CREATE TABLE IF NOT EXISTS legal_content (
  id VARCHAR(36) PRIMARY KEY,
  type ENUM('terms_and_conditions', 'privacy_policy', 'about_us', 'disclaimer', 'cookie_policy') NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  updated_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_type (type)
);

CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(36) PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value LONGTEXT,
  setting_type ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
  description VARCHAR(500),
  updated_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_setting_key (setting_key)
);

CREATE TABLE IF NOT EXISTS files (
  id VARCHAR(36) PRIMARY KEY,
  original_filename VARCHAR(255) NOT NULL,
  stored_filename VARCHAR(255) UNIQUE NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT NOT NULL,
  file_type VARCHAR(100),
  mime_type VARCHAR(100),
  uploaded_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_uploaded_by (uploaded_by),
  INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS locations (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description LONGTEXT,
  image_url VARCHAR(500),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_created_at (created_at)
);
