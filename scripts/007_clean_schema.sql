-- Clean and fix users table schema
-- Remove duplicates and keep only necessary columns

-- Drop old constraints and recreate table with clean schema
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_payment_status_check;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_account_status_check;

-- Add missing columns if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) DEFAULT 'inactive';
ALTER TABLE users ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Drop duplicate verification columns - keep only updated_at
ALTER TABLE users DROP COLUMN IF EXISTS verified_at;
ALTER TABLE users DROP COLUMN IF EXISTS payment_verified_at;

-- Add constraints for valid values
ALTER TABLE users 
ADD CONSTRAINT users_payment_status_check CHECK (payment_status IN ('pending', 'completed', 'verified', 'rejected'));

ALTER TABLE users 
ADD CONSTRAINT users_account_status_check CHECK (account_status IN ('inactive', 'pending', 'active', 'rejected'));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);
CREATE INDEX IF NOT EXISTS idx_users_payment_status ON users(payment_status);
CREATE INDEX IF NOT EXISTS idx_users_transaction_id ON users(transaction_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own data
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" 
ON users FOR SELECT 
USING (auth.uid() = id);

-- RLS Policy: Users can update their own data
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" 
ON users FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- RLS Policy: Allow insert for new users during signup
DROP POLICY IF EXISTS "Users can insert own record" ON users;
CREATE POLICY "Users can insert own record" 
ON users FOR INSERT 
WITH CHECK (auth.uid() = id);
