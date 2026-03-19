# Database Setup Instructions

## Execute this SQL in Supabase SQL Editor

```sql
-- Clean users table schema
-- Remove duplicates and keep only necessary columns

-- Step 1: Drop old constraints
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_payment_status_check;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_account_status_check;

-- Step 2: Add missing columns if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) DEFAULT 'inactive';
ALTER TABLE users ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Step 3: Drop duplicate verification columns - keep only updated_at
ALTER TABLE users DROP COLUMN IF EXISTS verified_at;
ALTER TABLE users DROP COLUMN IF EXISTS payment_verified_at;

-- Step 4: Add constraints for valid values
ALTER TABLE users 
ADD CONSTRAINT users_payment_status_check CHECK (payment_status IN ('pending', 'completed', 'verified', 'rejected'));

ALTER TABLE users 
ADD CONSTRAINT users_account_status_check CHECK (account_status IN ('inactive', 'pending', 'active', 'rejected'));

-- Step 5: Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);
CREATE INDEX IF NOT EXISTS idx_users_payment_status ON users(payment_status);
CREATE INDEX IF NOT EXISTS idx_users_transaction_id ON users(transaction_id);

-- Step 6: Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop old policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own record" ON users;

-- Step 8: Create RLS Policies
CREATE POLICY "Users can view own data" 
ON users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own data" 
ON users FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own record" 
ON users FOR INSERT 
WITH CHECK (auth.uid() = id);
```

## Account Status Flow

- **inactive**: User registered, awaiting payment
- **pending**: Transaction ID submitted, awaiting admin verification
- **active**: Admin approved, account fully verified
- **rejected**: Admin rejected the verification

## Payment Status Flow

- **pending**: Initial state, user hasn't paid
- **completed**: Payment processed successfully
- **verified**: Admin verified the payment
- **rejected**: Admin rejected the payment

## What Changed

1. **Removed duplicate columns**: `verified_at` and `payment_verified_at` - now just using `updated_at`
2. **Added `transaction_id` column**: To store user-provided Paystack transaction ID
3. **Fixed constraints**: Payment status and account status now only accept valid enum values
4. **Added indexes**: For faster queries on frequently filtered columns
5. **RLS Policies**: Users can only see/edit their own data
