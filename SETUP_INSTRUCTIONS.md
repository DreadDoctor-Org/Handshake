# Handshake Platform - Final Setup Instructions

## Critical: Execute SQL in Supabase Console

The application requires these database schema fixes. Copy and paste the following SQL into your Supabase SQL editor and execute it:

```sql
-- Step 1: Drop existing constraints and columns
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_payment_status_check;
ALTER TABLE users DROP COLUMN IF EXISTS payment_status CASCADE;
ALTER TABLE users DROP COLUMN IF EXISTS account_status CASCADE;
ALTER TABLE users DROP COLUMN IF EXISTS crypto CASCADE;
ALTER TABLE users DROP COLUMN IF EXISTS payment_method CASCADE;

-- Step 2: Create ENUM types
CREATE TYPE payment_status_enum AS ENUM ('pending', 'completed', 'verified');
CREATE TYPE account_status_enum AS ENUM ('inactive', 'active');

-- Step 3: Add columns back with correct types
ALTER TABLE users ADD COLUMN payment_status payment_status_enum NOT NULL DEFAULT 'pending';
ALTER TABLE users ADD COLUMN account_status account_status_enum NOT NULL DEFAULT 'inactive';

-- Step 4: Ensure all required columns exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country_code VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 5: Ensure ID column is UUID primary key
ALTER TABLE users ADD PRIMARY KEY (id) ON CONFLICT DO NOTHING;
```

## User Flow (Complete Process)

1. **Register** - User fills registration form with:
   - First Name + Last Name
   - Email
   - Country Code + Phone Number (stored combined as 254766058154)
   - Password

2. **Email Verification** - User receives confirmation email and clicks link

3. **Sign In** - User logs in with email and password

4. **Dashboard - Payment** - User sees payment form with $50 USD amount
   - Clicks "Pay Now" button
   - Paystack modal opens
   - User completes payment

5. **Dashboard - Transaction ID** - After payment, user sees transaction ID form
   - Finds transaction ID in Paystack confirmation
   - Pastes transaction ID into form
   - Clicks Submit

6. **Waitlist Page** - User redirected to waitlist showing:
   - Status: "Awaiting Admin Verification"
   - Transaction ID confirmation
   - Expected timeline (1-24 hours)

7. **Admin Verification** - Admin logs into Supabase and updates user:
   - Sets `account_status = 'active'`

8. **Verified Page** - User next login shows verified page with:
   - Account verified confirmation
   - Ready to start working
   - Access to features

## Environment Variables Required

Make sure these are set in your Vercel project Settings → Vars:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

## Key Changes Made

1. **Dashboard** - Properly handles all three states:
   - Shows payment form for `payment_status = 'pending'`
   - Shows transaction ID form for `payment_status = 'completed'`
   - Redirects to verified page for `account_status = 'active'`

2. **Paystack Integration** - Full payment flow:
   - Paystack script loaded in layout
   - Payment button calls Paystack modal
   - After successful payment, status updates to 'completed'
   - User submits transaction ID for verification

3. **Database Schema** - Cleaned up and optimized:
   - Only columns needed for the flow
   - Proper ENUM types for status fields
   - Full name stored as one column
   - Phone number combined with country code

## Testing the Flow

1. Register with test account
2. Verify email
3. Log in
4. See payment button
5. Use Paystack test card (if in test mode)
6. Submit transaction ID
7. Manually update `account_status` to 'active' in Supabase
8. Log out and log back in to see verified page

## Troubleshooting

- **"Failed to load user data"** - User record wasn't created. Dashboard will auto-create it on first login.
- **Payment constraint error** - Run the SQL above to fix enum types
- **Transaction ID not submitting** - Check that Supabase insert permissions are correct
- **Not redirecting to verified page** - Clear browser cache and reload

## Production Checklist

- [ ] SQL migration executed in Supabase
- [ ] All environment variables set
- [ ] Paystack live keys configured (not test keys)
- [ ] Email verification working
- [ ] Payment flow tested end-to-end
- [ ] Admin can verify accounts in Supabase
- [ ] Users see verified page after admin verification
