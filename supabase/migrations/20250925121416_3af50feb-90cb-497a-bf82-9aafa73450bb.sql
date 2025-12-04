-- Add missing columns to properties table for enhanced property details

ALTER TABLE public.properties 
ADD COLUMN plot_facing text,
ADD COLUMN plot_type text,
ADD COLUMN commercial_type text,
ADD COLUMN floor_number text,
ADD COLUMN furnishing text,
ADD COLUMN deposit numeric;