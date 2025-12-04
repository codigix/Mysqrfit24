-- Fix the search_path security warning by updating functions
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'  -- Explicitly set search path
AS $$
BEGIN
  -- Check if there are no admins yet
  IF NOT EXISTS (SELECT 1 FROM public.admin_profiles WHERE role = 'admin') THEN
    -- Make the first user an admin
    INSERT INTO public.admin_profiles (user_id, email, role)
    VALUES (
      NEW.id,
      NEW.email,
      'admin'
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'  -- Explicitly set search path
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user ID from auth.users based on email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.admin_profiles (user_id, email, role)
    VALUES (target_user_id, user_email, 'admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
  END IF;
END;
$$;