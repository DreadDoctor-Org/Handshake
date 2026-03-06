# Handshake Database Schema

## Overview

The Handshake platform uses Supabase PostgreSQL with Row Level Security (RLS) for secure data management. The system includes two main tables: `users` for account information and `payments` for transaction audit logs.

---

## Table: public.users

**Purpose**: Store all user credentials, account information, and payment status.

**Admin Management**: This table is designed for comprehensive admin management of user accounts, payments, and access.

### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | - | Primary key, references auth.users(id) with CASCADE delete |
| `email` | TEXT | NO | - | User's email address (from auth.users) |
| `username` | TEXT | NO | UNIQUE | Unique username for login display |
| `full_name` | TEXT | YES | - | Optional full name for display |
| `payment_method` | TEXT | NO | 'crypto' | Payment type (currently only 'crypto') |
| `transaction_id` | TEXT | YES | UNIQUE | Tron transaction hash/ID for payment proof |
| `payment_amount` | DECIMAL(10,2) | YES | 50.00 | Amount in USD ($50.00 standard) |
| `payment_status` | TEXT | NO | 'pending' | pending, completed, failed, verified |
| `account_status` | TEXT | NO | 'inactive' | inactive, active, suspended, admin |
| `admin_notes` | TEXT | YES | - | Notes added by admin during verification |
| `country` | TEXT | YES | - | User's country (for future filtering) |
| `created_at` | TIMESTAMP TZ | NO | now() | Account creation timestamp |
| `updated_at` | TIMESTAMP TZ | NO | now() | Last update timestamp |
| `verified_at` | TIMESTAMP TZ | YES | - | When admin verified the account |

### Constraints

```sql
-- Primary key
PRIMARY KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE

-- Unique constraints
UNIQUE (username)
UNIQUE (transaction_id)

-- Check constraints
CHECK (payment_method IN ('crypto'))
CHECK (payment_status IN ('pending', 'completed', 'failed', 'verified'))
CHECK (account_status IN ('inactive', 'active', 'suspended', 'admin'))
```

### Row Level Security (RLS)

```sql
-- Users can view their own profile
SELECT: auth.uid() = id

-- Users can update their own profile
UPDATE: auth.uid() = id

-- Users can insert their own profile
INSERT: auth.uid() = id

-- Admin role can access all records
ALL: service_role OR account_status = 'admin'
```

### Example User Record

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "username": "john_doe",
  "full_name": "John Doe",
  "payment_method": "crypto",
  "transaction_id": "0x123abc456def789ghi",
  "payment_amount": 50.00,
  "payment_status": "pending",
  "account_status": "inactive",
  "admin_notes": null,
  "country": "NG",
  "created_at": "2026-03-06T12:00:00+00:00",
  "updated_at": "2026-03-06T12:00:00+00:00",
  "verified_at": null
}
```

---

## Table: public.payments

**Purpose**: Audit log for all payment transactions (immutable record for compliance).

### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `user_id` | UUID | NO | - | Foreign key to users(id) |
| `payment_method` | TEXT | NO | 'crypto' | Payment method used (crypto) |
| `amount_usd` | DECIMAL(10,2) | YES | - | Amount paid in USD |
| `transaction_id` | TEXT | NO | - | Blockchain transaction hash/ID |
| `crypto_tx_hash` | TEXT | YES | - | Extended Tron transaction details |
| `status` | TEXT | NO | 'pending' | pending, completed, failed, cancelled |
| `metadata` | JSONB | YES | - | Additional transaction data |
| `created_at` | TIMESTAMP TZ | NO | now() | When transaction was recorded |
| `updated_at` | TIMESTAMP TZ | NO | now() | Last update timestamp |

### Constraints

```sql
-- Foreign key
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

-- Check constraint
CHECK (status IN ('pending', 'completed', 'failed', 'cancelled'))
```

### Row Level Security (RLS)

```sql
-- Users can view their own payments
SELECT: auth.uid() = user_id

-- Users can create payment records
INSERT: auth.uid() = user_id
```

### Example Payment Record

```json
{
  "id": "987f6543-e89b-12d3-a456-426614174999",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "payment_method": "crypto",
  "amount_usd": 50.00,
  "transaction_id": "0x123abc456def789ghi",
  "crypto_tx_hash": "tron_blockchain_hash",
  "status": "pending",
  "metadata": {
    "wallet": "TVexA5Ztzc2o4RfSqZUvKhXofz1viT2e6u",
    "network": "tron",
    "token": "usdt"
  },
  "created_at": "2026-03-06T13:30:00+00:00",
  "updated_at": "2026-03-06T13:30:00+00:00"
}
```

---

## Admin Operations

### Verify a Payment

```sql
-- Admin verifies payment and activates account
UPDATE public.users
SET 
  payment_status = 'verified',
  account_status = 'active',
  verified_at = now(),
  admin_notes = 'Transaction verified on blockchain',
  updated_at = now()
WHERE id = '123e4567-e89b-12d3-a456-426614174000';
```

### Fail a Payment

```sql
-- Admin rejects payment and requests retry
UPDATE public.users
SET 
  payment_status = 'failed',
  payment_status = 'failed',
  admin_notes = 'Transaction not found on blockchain. Please resubmit.',
  updated_at = now()
WHERE id = '123e4567-e89b-12d3-a456-426614174000';
```

### View All Pending Payments

```sql
SELECT 
  u.username,
  u.email,
  u.transaction_id,
  u.payment_status,
  u.created_at,
  u.updated_at
FROM public.users u
WHERE u.payment_status = 'pending'
ORDER BY u.created_at ASC;
```

### View User's Payment History

```sql
SELECT 
  p.id,
  p.amount_usd,
  p.transaction_id,
  p.status,
  p.created_at
FROM public.payments p
WHERE p.user_id = '123e4567-e89b-12d3-a456-426614174000'
ORDER BY p.created_at DESC;
```

---

## Payment Status Lifecycle

```
user registers
    ↓
confirms email
    ↓
signs in
    ↓
submits transaction ID → payment_status = 'pending'
    ↓
[ADMIN VERIFICATION]
    ↓
admin approves → payment_status = 'verified' & account_status = 'active'
    ↓
user receives confirmation email
    ↓
user has full access
```

---

## Account Status Meanings

- **inactive**: Default state, awaiting payment and verification
- **active**: Account verified and fully functional
- **suspended**: Account disabled (admin action)
- **admin**: Has admin privileges in the system

---

## Data Privacy & Security

- ✓ Row Level Security (RLS) enforces user privacy
- ✓ Users can only access their own records
- ✓ Passwords hashed by Supabase Auth
- ✓ Transaction IDs stored for verification audit trail
- ✓ Admin operations traceable via updated_at and admin_notes
- ✓ No sensitive payment details stored (only transaction ID)
- ✓ GDPR compliant with ON DELETE CASCADE

---

## Migration Files

- `scripts/001_create_users_table.sql` - Creates users table with RLS
- `scripts/002_create_payments_table.sql` - Creates payments audit table with RLS

Both must be applied in order to Supabase database.
