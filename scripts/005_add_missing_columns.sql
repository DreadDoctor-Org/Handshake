-- Add missing columns to users table for new registration flow
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS country_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ;

-- Create index for transaction_id lookups
CREATE INDEX IF NOT EXISTS idx_users_transaction_id ON users(transaction_id);
