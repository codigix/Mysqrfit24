-- Create a function to make the first authenticated user an admin
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Create trigger to automatically make first user an admin
DROP TRIGGER IF EXISTS on_first_user_bootstrap ON auth.users;
CREATE TRIGGER on_first_user_bootstrap
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.bootstrap_first_admin();

-- Also create a manual function to promote a user to admin (for later use)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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