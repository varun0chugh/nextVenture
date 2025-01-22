/*
  # Fix user profile and role creation

  1. Changes
    - Add trigger to automatically create profile when user signs up
    - Add trigger to create default student role for new users
    - Add function to handle user creation
    - Add function to handle role assignment

  2. Security
    - Maintain existing RLS policies
    - Add security definer to functions
*/

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    now(),
    now()
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'student');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile and role for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();