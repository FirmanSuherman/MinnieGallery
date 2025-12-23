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