-- Drop the old constraint that has invalid enum values
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_payment_status_check;

-- Drop the old column if it exists with wrong type
ALTER TABLE users DROP COLUMN IF EXISTS payment_status CASCADE;

-- Add payment_status as a proper ENUM type
CREATE TYPE payment_status_enum AS ENUM ('pending', 'completed', 'verified');

ALTER TABLE users ADD COLUMN payment_status payment_status_enum NOT NULL DEFAULT 'pending';

-- Ensure account_status is correct
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_account_status_check;
CREATE TYPE account_status_enum AS ENUM ('inactive', 'active');
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status account_status_enum NOT NULL DEFAULT 'inactive';

-- Remove duplicate columns and keep only what we need
ALTER TABLE users DROP COLUMN IF EXISTS crypto CASCADE;
ALTER TABLE users DROP COLUMN IF EXISTS payment_method CASCADE;

-- Ensure all required columns exist with correct types
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country_code VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255) UNIQUE;

-- Ensure timestamps exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
