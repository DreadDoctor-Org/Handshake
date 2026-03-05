# Handshake Registration & Payment Website - Setup Guide

This is a complete registration and payment processing system built with Next.js, Supabase, and Stripe.

## Environment Variables Required

Add these to your `.env.local` or Vercel project settings:

### Supabase (Already Set)
- `NEXT_PUBLIC_SUPABASE_URL` ✓
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓
- `SUPABASE_SERVICE_ROLE_KEY` ✓
- `POSTGRES_URL` ✓

### Stripe (Required)
- `STRIPE_SECRET_KEY` - Get from https://dashboard.stripe.com/apikeys
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Get from https://dashboard.stripe.com/apikeys
- `STRIPE_WEBHOOK_SECRET` - Create a webhook endpoint at https://dashboard.stripe.com/webhooks
- `NEXT_PUBLIC_APP_URL` - Your app URL (e.g., http://localhost:3000 for dev)

## Database Setup

The application requires two database tables. Execute the migration scripts:

### Option 1: Via Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project
3. Go to SQL Editor
4. Create a new query
5. Copy and paste the contents of `/scripts/001_create_users_table.sql`
6. Click "Run"
7. Repeat with `/scripts/002_create_payments_table.sql`

### Option 2: Via Script Execution
```bash
# These will be executed automatically when running the deployment
pnpm install
pnpm run build
```

## Feature Overview

### 1. Landing Page (`/`)
- Hero section with Handshake branding
- Feature highlights
- Payment process overview
- Call-to-action buttons

### 2. Registration (`/auth/register`)
- Username, email, password registration
- Form validation with Zod
- Supabase Auth integration
- Auto-creates user profile
- Redirects to payment selection

### 3. Payment Selection (`/payment/choose`)
- Choose between card or crypto payment
- Clear feature comparison
- Links to payment methods

### 4. Card Payment (`/payment/card`)
- Stripe Checkout integration
- Payment summary
- Security information
- Redirects to Stripe's hosted checkout

### 5. Crypto Payment (`/payment/crypto`)
- Display Tron wallet address: `TVexA5Ztzc2o4RfSqZUvKhXofz1viT2e6u`
- Transaction ID input
- Copy wallet address functionality
- Payment instructions
- Stores transaction for admin verification

### 6. Confirmation (`/payment/confirmation`)
- Payment status display
- Account information
- What happens next timeline
- Support contact information

### 7. Login (`/auth/login`)
- Email/password sign in
- Redirect to confirmation page
- Link to registration

## Stripe Integration

### Setting Up Stripe
1. Create a Stripe account at https://stripe.com
2. Get your API keys from https://dashboard.stripe.com/apikeys
3. Add to environment variables:
   - `STRIPE_SECRET_KEY` (Secret key)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Publishable key)

### Webhook Setup
1. Go to https://dashboard.stripe.com/webhooks
2. Create a new webhook endpoint
3. Use your deployment URL: `https://your-domain.com/api/stripe/webhook`
4. Select events: `checkout.session.completed`, `charge.failed`
5. Copy the Webhook Secret and add to `STRIPE_WEBHOOK_SECRET`

### Webhook Signing Secret
```
Format: whsec_xxxxx...
Location: https://dashboard.stripe.com/webhooks
```

## Payment Flow

### Card Payment
1. User selects card payment
2. Redirected to Stripe Checkout
3. Completes payment on Stripe's hosted page
4. Webhook confirms payment
5. User record updated with payment status
6. Redirected to confirmation page

### Crypto Payment
1. User selects crypto payment
2. Wallet address displayed
3. Instructions provided
4. User sends transaction
5. User enters transaction ID
6. Transaction ID stored in database
7. Admin verifies payment and updates status

## Admin Verification

### Current Status
Payments start with `payment_status = 'pending'`

### Admin Actions
1. Access Supabase dashboard
2. View `users` table
3. Check `payment_method`, `transaction_id`, `payment_status`
4. For crypto: Verify transaction on Tron blockchain
5. Update `payment_status` to:
   - `'completed'` - Payment verified
   - `'failed'` - Payment invalid

Automated email notifications can be added in a future version.

## Development

### Install Dependencies
```bash
pnpm install
```

### Run Dev Server
```bash
pnpm run dev
```

Open http://localhost:3000

### Build
```bash
pnpm run build
```

### Database Migrations
Migrations are in `/scripts/`:
- `001_create_users_table.sql` - User profiles with payment tracking
- `002_create_payments_table.sql` - Payment audit log

## Database Schema

### users table
```sql
- id (UUID) - Primary key, references auth.users
- username (TEXT) - Unique username
- payment_method (TEXT) - 'stripe' | 'crypto' | 'pending'
- transaction_id (TEXT) - Payment reference
- payment_status (TEXT) - 'pending' | 'completed' | 'failed'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### payments table
```sql
- id (UUID) - Primary key
- user_id (UUID) - Foreign key to users
- payment_method (TEXT) - 'stripe' | 'crypto'
- amount_usd (DECIMAL) - Payment amount
- transaction_id (TEXT) - User-provided crypto tx ID
- stripe_payment_intent_id (TEXT) - Stripe payment ID
- crypto_tx_hash (TEXT) - Blockchain transaction hash
- status (TEXT) - 'pending' | 'completed' | 'failed' | 'cancelled'
- metadata (JSONB) - Additional data
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## RLS Policies

Row Level Security is enabled on both tables. Users can only:
- View their own records
- Insert their own records
- Update their own records

Admin can access all records using service role key.

## Troubleshooting

### "Stripe is not configured"
- Add `STRIPE_SECRET_KEY` to environment variables
- Ensure it starts with `sk_` for live or `sk_test_` for test mode

### "Missing Supabase keys"
- Verify environment variables are set correctly
- Check Supabase dashboard for correct project URL and keys

### Payment status not updating
- Check Stripe webhook is configured correctly
- Verify webhook secret matches `STRIPE_WEBHOOK_SECRET`
- Check Vercel function logs for webhook processing errors

### Crypto payment not saving
- Ensure user is logged in
- Check Supabase user has correct permissions
- Verify transaction ID format matches expected pattern

## Security

✓ Passwords handled by Supabase Auth (industry standard hashing)
✓ RLS policies protect user data
✓ Stripe payment data never stored locally
✓ Webhook signatures verified before processing
✓ Client-side validation with Zod
✓ Input sanitization and parameterized queries
✓ HTTP-only cookies for session management
✓ HTTPS enforced in production

## Support

For issues or questions:
1. Check logs: `pnpm run dev` console output
2. Verify environment variables in project settings
3. Check Supabase dashboard for database status
4. Review Stripe dashboard for payment errors
5. Contact support at support@handshake.com

## Next Steps

1. Add email verification to registration (optional)
2. Build admin dashboard for payment verification
3. Add automated email notifications
4. Implement two-factor authentication
5. Add payment history dashboard for users
6. Multi-currency support
7. Subscription billing (if needed)
