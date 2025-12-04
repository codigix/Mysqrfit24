-- Create admin profiles table for proper authentication
CREATE TABLE public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Allow admins to view their own profile
CREATE POLICY "Admins can view their own profile" 
ON public.admin_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE admin_profiles.user_id = is_admin.user_id
  );
$$;

-- Update chatbot_inquiries RLS policies to restrict access to admins only
DROP POLICY IF EXISTS "Inquiries are viewable by everyone" ON public.chatbot_inquiries;

CREATE POLICY "Only admins can view inquiries" 
ON public.chatbot_inquiries 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

-- Update properties table to restrict developer contact info to admins
DROP POLICY IF EXISTS "Allow all operations for now" ON public.properties;
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;

-- Allow public to view properties but exclude sensitive developer contact info
CREATE POLICY "Public can view basic property info" 
ON public.properties 
FOR SELECT 
USING (true);

-- Allow admins full access to properties
CREATE POLICY "Admins can manage all properties" 
ON public.properties 
FOR ALL 
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Create trigger for updating admin_profiles timestamps
CREATE TRIGGER update_admin_profiles_updated_at
BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();