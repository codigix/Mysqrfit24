-- Add virtual tour columns to properties table if they don't exist
ALTER TABLE properties ADD COLUMN virtual_walkthrough_url VARCHAR(500) AFTER developer_whatsapp;
ALTER TABLE properties ADD COLUMN map_virtual_tour_url VARCHAR(500) AFTER virtual_walkthrough_url;
