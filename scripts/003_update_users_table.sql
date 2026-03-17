-- Add new fields to users table for international payment support
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS paystack_reference VARCHAR(100),
ADD COLUMN IF NOT EXISTS payment_currency VARCHAR(10) DEFAULT 'USD';

-- Create index for paystack reference
CREATE INDEX IF NOT EXISTS idx_paystack_reference ON users(paystack_reference);
