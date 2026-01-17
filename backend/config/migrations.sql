-- Add virtual tour columns to properties table if they don't exist
ALTER TABLE properties ADD COLUMN IF NOT EXISTS virtual_walkthrough_url VARCHAR(500) AFTER developer_whatsapp;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS map_virtual_tour_url VARCHAR(500) AFTER virtual_walkthrough_url;

-- Update properties table with missing columns and expanded ENUMs
ALTER TABLE properties MODIFY COLUMN type ENUM('sale', 'rent', 'lease') NOT NULL;
ALTER TABLE properties MODIFY COLUMN property_type ENUM('apartment', 'house', 'villa', 'commercial', 'land', 'flats', 'rowhouses', 'godowns', 'shops', 'openland') NOT NULL;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS plot_area DECIMAL(10, 2) AFTER area;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS facing VARCHAR(50) AFTER longitude;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS flooring VARCHAR(100) AFTER facing;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS parking INT AFTER flooring;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS age INT AFTER parking;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS furnishing ENUM('unfurnished', 'semi-furnished', 'furnished') DEFAULT 'unfurnished' AFTER age;
