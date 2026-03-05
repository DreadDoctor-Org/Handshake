import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  try {
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object,
          supabase
        )
        break
      case 'charge.failed':
        await handleChargeFailed(
          event.data.object,
          supabase
        )
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: any, supabase: any) {
  const userId = session.client_reference_id
  const paymentIntentId = session.payment_intent

  if (!userId) {
    console.error('No userId in session')
    return
  }

  // Update user payment status
  const { error: updateError } = await supabase
    .from('users')
    .update({
      payment_method: 'stripe',
      transaction_id: paymentIntentId,
      payment_status: 'completed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (updateError) {
    console.error('Error updating user payment status:', updateError)
    return
  }

  // Create payment record
  const { error: paymentError } = await supabase
    .from('payments')
    .insert([
      {
        user_id: userId,
        payment_method: 'stripe',
        amount_usd: session.amount_total / 100,
        stripe_payment_intent_id: paymentIntentId,
        status: 'completed',
      },
    ])

  if (paymentError) {
    console.error('Error creating payment record:', paymentError)
  }
}

async function handleChargeFailed(charge: any, supabase: any) {
  // You can handle failed charges here if needed
  console.log('Charge failed:', charge.id)
}
