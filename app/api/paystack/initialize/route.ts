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

    // Optionally restrict channels via env (comma-separated, e.g. "card,bank").
    // Leave unset to let Paystack use every active channel for the currency.
    const channelsEnv = process.env.PAYSTACK_CHANNELS
    const channels = channelsEnv
      ? channelsEnv.split(',').map((c) => c.trim()).filter(Boolean)
      : undefined

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
        ...(channels ? { channels } : {}),
        metadata: {
          userId,
          firstName,
          lastName,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      // Surface the exact Paystack error so channel/currency issues are diagnosable.
      console.error('[v0] Paystack initialize failed:', {
        status: response.status,
        currency,
        message: data?.message,
      })
      return NextResponse.json(
        { message: data?.message || 'Failed to initialize payment' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Paystack initialization error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
