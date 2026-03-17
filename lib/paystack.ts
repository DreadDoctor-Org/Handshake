// Paystack integration utility
// Note: Add your Paystack public and secret keys to environment variables

export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''

export interface PaystackInitializePaymentPayload {
  email: string
  amount: number // Amount in cents (smallest currency unit)
  currency: 'USD' | 'KES' | 'ZAR' | 'GHS' | 'NGN'
  firstName: string
  lastName: string
  userId: string
}

export interface PaystackVerifyPaymentResponse {
  status: boolean
  message: string
  data: {
    id: number
    reference: string
    amount: number
    currency: string
    paid_at: string
    created_at: string
    customer: {
      id: number
      email: string
    }
    status: string
  }
}

// Initialize payment via backend API
export const initializePayment = async (payload: PaystackInitializePaymentPayload) => {
  try {
    const response = await fetch('/api/paystack/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to initialize payment')
    }

    return await response.json()
  } catch (error) {
    console.error('Paystack initialization error:', error)
    throw error
  }
}

export const verifyPayment = async (reference: string): Promise<PaystackVerifyPaymentResponse> => {
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to verify payment')
    }

    return await response.json()
  } catch (error) {
    console.error('Paystack verification error:', error)
    throw error
  }
}

export const formatAmountForPaystack = (amount: number, currency: 'USD' | 'KES' | 'ZAR' | 'GHS' | 'NGN'): number => {
  // Paystack expects amounts in the smallest currency unit
  // USD: cents (multiply by 100)
  // KES, ZAR, GHS, NGN: base units (multiply by 100)
  return Math.round(amount * 100)
}

export const determinePaymentCurrency = (country?: string): 'USD' | 'KES' | 'ZAR' | 'GHS' | 'NGN' => {
  if (!country) return 'USD'
  
  const countryUpper = country.toUpperCase()
  
  if (countryUpper.includes('KENYA')) return 'KES'
  if (countryUpper.includes('SOUTH AFRICA')) return 'ZAR'
  if (countryUpper.includes('GHANA')) return 'GHS'
  if (countryUpper.includes('NIGERIA')) return 'NGN'
  
  return 'USD'
}
