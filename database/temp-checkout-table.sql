-- Temporary Checkout Data Table
-- Stores intake data temporarily to avoid Stripe metadata size limits
-- Data expires after 24 hours

CREATE TABLE temp_checkout_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checkout_id TEXT UNIQUE NOT NULL,
    intake_payload JSONB NOT NULL,
    customer_email TEXT NOT NULL,
    delivery_speed TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Create index for fast lookup by checkout_id
CREATE INDEX idx_temp_checkout_checkout_id ON temp_checkout_data(checkout_id);

-- Create index for cleanup of expired records
CREATE INDEX idx_temp_checkout_expires_at ON temp_checkout_data(expires_at);

-- Enable Row Level Security
ALTER TABLE temp_checkout_data ENABLE ROW LEVEL SECURITY;

-- Add helpful comments
COMMENT ON TABLE temp_checkout_data IS 'Temporary storage for checkout data to avoid Stripe metadata limits';
COMMENT ON COLUMN temp_checkout_data.checkout_id IS 'Unique identifier linking to Stripe session';
COMMENT ON COLUMN temp_checkout_data.expires_at IS 'Automatic cleanup after 24 hours';
