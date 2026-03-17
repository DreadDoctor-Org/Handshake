import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { message: 'Paystack configuration missing' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { email, amount, currency, firstName, lastName, userId } = body

    if (!email || !amount || !currency || !firstName || !lastName || !userId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        currency,
        first_name: firstName,
        last_name: lastName,
        metadata: {
          userId,
          firstName,
          lastName,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || 'Failed to initialize payment' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Paystack initialization error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
