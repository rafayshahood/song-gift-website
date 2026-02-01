-- Newsletter Subscribers Table Creation
-- Date: 2026-02-01
-- Purpose: Store newsletter subscription data for SongGift website

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    source TEXT NOT NULL DEFAULT 'songgift.app',
    session_id TEXT,
    page_path TEXT,
    user_agent TEXT
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON newsletter_subscribers(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_source ON newsletter_subscribers(source);

-- Add helpful comments
COMMENT ON TABLE newsletter_subscribers IS 'Stores newsletter subscription data from website popup';
COMMENT ON COLUMN newsletter_subscribers.id IS 'Unique identifier for subscription';
COMMENT ON COLUMN newsletter_subscribers.email IS 'Subscriber email address (unique)';
COMMENT ON COLUMN newsletter_subscribers.created_at IS 'Timestamp when subscription was created';
COMMENT ON COLUMN newsletter_subscribers.source IS 'Source of subscription (e.g., songgift.app)';
COMMENT ON COLUMN newsletter_subscribers.session_id IS 'Frontend session ID for tracking';
COMMENT ON COLUMN newsletter_subscribers.page_path IS 'Page where subscription occurred';
COMMENT ON COLUMN newsletter_subscribers.user_agent IS 'Browser user agent string';

-- Enable Row Level Security (RLS) for security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for API)
CREATE POLICY "Allow newsletter subscription inserts" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Create policy to allow service role to read (for admin/analytics)
CREATE POLICY "Allow service role to read newsletter subscribers" ON newsletter_subscribers
    FOR SELECT USING (auth.role() = 'service_role');
