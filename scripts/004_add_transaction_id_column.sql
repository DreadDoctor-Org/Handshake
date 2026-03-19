-- Add transaction_id column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255) UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_transaction_id ON users(transaction_id);
