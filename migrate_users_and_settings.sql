-- Create app_settings table for storing application settings
CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default like setting
INSERT INTO app_settings (key, value) 
VALUES ('likes_enabled', 'true')
ON CONFLICT (key) 
DO UPDATE SET value = 'true', updated_at = NOW();

-- Enable Row Level Security (RLS) 
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read settings
CREATE POLICY "Allow authenticated users to read settings" ON app_settings
FOR SELECT TO authenticated
USING (true);

-- Create policy to allow service role to manage settings
CREATE POLICY "Allow service role to manage settings" ON app_settings
FOR ALL TO service_role
USING (true);

-- Create policy to allow authenticated users to update settings
CREATE POLICY "Allow authenticated users to update settings" ON app_settings
FOR ALL TO authenticated
USING (true);

-- Create a function to automatically create user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read user data
CREATE POLICY "Allow users to read user data" ON users
FOR SELECT TO authenticated
USING (true);

-- Create trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();