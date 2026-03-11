# Handshake - Complete User Registration & Payment Flow

## System Overview

This document outlines the complete user flow for the Handshake annotation training and verified accounts platform.

---

## User Journey

### Step 1: Landing Page
- **URL**: `/`
- **What Users See**:
  - Gradient background (lime green to teal)
  - Handshake logo in header
  - "Register Now" and "Sign In" buttons
  - Platform benefits and 4-step process visualization
  - Clear messaging about verified handshake accounts for global and international users
  
---

### Step 2: User Registration
- **URL**: `/auth/register`
- **User Actions**:
  1. Fill in registration form:
     - Username (unique)
     - Email address
     - Password (min 8 characters)
     - Confirm password
  2. Click "Create Account"
  
- **Backend Process**:
  - Supabase Auth creates user account
  - User record stored in `public.users` table with:
    - `id` (UUID from auth.users)
    - `email` (from form)
    - `username` (from form)
    - `payment_method` = 'crypto'
    - `payment_status` = 'pending'
    - `account_status` = 'inactive'
    - `created_at` timestamp

- **User Feedback**:
  - Toast success notification
  - Success message shown on page
  - Instructed to check email for confirmation link

---

### Step 3: Email Confirmation
- **User Actions**:
  1. Check email inbox
  2. Click confirmation link from Supabase
  3. Email is now verified in auth.users table

---

### Step 4: Sign In to Dashboard
- **URL**: `/auth/login`
- **User Actions**:
  1. Enter email address
  2. Enter password
  3. Click "Sign In"

- **Backend Process**:
  - Supabase Auth validates credentials
  - Session token created
  - User redirected to dashboard

- **User Feedback**:
  - Toast success: "Welcome Back!"
  - Automatic redirect to dashboard

---

### Step 5: Dashboard with Payment Instructions
- **URL**: `/dashboard`
- **What Users See**:
  - Welcome card with username
  - Payment status card (Awaiting Payment)
  - **6-Step Payment Instructions** (clearly numbered):
    1. Copy the Wallet Address - Scroll down to see your payment address
    2. Open Your Crypto Wallet - Use Binance, Trust Wallet, TronLink, or any crypto exchange
    3. Send $50 USDT - Send exactly $50 to the Tron wallet address (using USDT on Tron network)
    4. Copy Your Transaction ID - After sending, copy the transaction hash/ID from your wallet
    5. Submit Transaction ID - Click the button to submit your transaction ID
    6. Wait for Admin Verification - Admin will verify and activate your account (usually 24 hours)

  - Crypto payment information card showing:
    - Wallet Address: `TVexA5Ztzc2o4RfSqZUvKhXofz1viT2e6u`
    - Amount: $50 USDT
    - Network: Tron (TRC-20)
  
  - Account information card
  - "Submit Payment & Transaction ID" button

---

### Step 6: Crypto Payment Page
- **URL**: `/payment/crypto`
- **What Users See**:
  - Payment details (Amount: $50, Method: USDT, Network: Tron)
  - Tron wallet address with one-click copy button
  - Form to submit transaction ID
  - Step-by-step instructions
  - Footer with copyright year

- **User Actions**:
  1. Copy wallet address
  2. Go to crypto wallet (Binance, Trust Wallet, etc.)
  3. Send $50 USDT to the wallet address
  4. Copy transaction ID from wallet
  5. Return to this page and paste transaction ID
  6. Click "Submit Transaction ID"

- **Backend Process**:
  - Transaction ID saved to `public.users.transaction_id`
  - Payment record created in `public.payments` table:
    - `user_id`
    - `payment_method` = 'crypto'
    - `amount_usd` = 50.00
    - `transaction_id`
    - `status` = 'pending'
  - User redirected to dashboard

- **User Feedback**:
  - Toast success: "Payment Submitted! Transaction ID recorded. Waiting for admin verification."
  - Automatic redirect to dashboard

---

### Step 7: Awaiting Admin Verification
- **Dashboard Status**:
  - Payment status: "⏳ Awaiting Payment"
  - Transaction ID visible
  - Blue instruction box explaining: "Our admin will verify and activate your account (usually 24 hours)"
  - Can sign out and check back later

- **Admin Actions** (performed in Supabase):
  1. Admin goes to `public.users` table
  2. Verifies transaction on blockchain
  3. Updates user record:
     - `payment_status` = 'completed'
     - `account_status` = 'active'
     - `verified_at` = timestamp
     - Optionally adds `admin_notes`
  4. Sends confirmation email to user

---

### Step 8: Account Activated
- **User Feedback**:
  - Receives confirmation email from admin
  - Logs back in
  - Dashboard shows: "✓ Payment Confirmed"
  - Green success message
  - Access to Handshake training classes and verified accounts

---

## Database Schema

### users Table
```
- id (UUID, PK, FK to auth.users)
- email (text, required)
- username (text, unique, required)
- full_name (text, optional)
- payment_method (text, default 'crypto')
- transaction_id (text, unique)
- payment_amount (decimal, default 50.00)
- payment_status (enum: pending, completed, failed, verified)
- account_status (enum: inactive, active, suspended, admin)
- admin_notes (text, optional)
- country (text, optional)
- created_at (timestamp)
- updated_at (timestamp)
- verified_at (timestamp, optional)
```

### payments Table (Audit Log)
```
- id (UUID, PK)
- user_id (UUID, FK to users)
- payment_method (text, default 'crypto')
- amount_usd (decimal)
- transaction_id (text)
- crypto_tx_hash (text, optional)
- status (enum: pending, completed, failed, cancelled)
- metadata (jsonb, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## Key Features

✓ **Email Confirmation Required** - Users must confirm email before payment
✓ **Login-First Payment** - Users sign in to dashboard before making payment
✓ **Admin-Only Verification** - Payment verified manually by admin, not system
✓ **Clear Instructions** - 6-step guide on dashboard and payment page
✓ **Toast Notifications** - Real-time feedback for all actions
✓ **Gradient Theme** - Consistent #B8F663 to #00D3D8 gradient
✓ **App Icon** - Handshake logo on all pages
✓ **Dynamic Copyright** - Current year in all footers
✓ **No Payment Loops** - Linear flow from registration to payment verification
✓ **Error Handling** - Comprehensive error messages and retry options

---

## Admin Dashboard (Future)

The `public.users` table is structured for admin management:
- View all users and their payment status
- Verify transactions manually
- Update payment_status and account_status
- Add admin notes
- Monitor failed payments
- Manage suspended accounts

---

## Environment Variables Required

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Email confirmation enabled in Supabase Auth

---

## Testing Checklist

- [ ] User can register with email
- [ ] Confirmation email is sent
- [ ] User can sign in after confirming email
- [ ] Dashboard shows payment instructions
- [ ] Wallet address can be copied
- [ ] Transaction ID can be submitted
- [ ] User is redirected to dashboard after payment submission
- [ ] Toast notifications appear at each step
- [ ] Admin can update payment_status in Supabase
- [ ] User sees "Payment Confirmed" after admin verification
- [ ] All pages have proper footer with current year
- [ ] Gradient theme is consistent
- [ ] App icon appears in all headers
