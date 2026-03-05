import { z } from 'zod'

export const cryptoPaymentSchema = z.object({
  transactionId: z
    .string()
    .min(1, 'Transaction ID is required')
    .regex(/^[a-zA-Z0-9]+$/, 'Transaction ID must be alphanumeric'),
})

export type CryptoPaymentSchema = z.infer<typeof cryptoPaymentSchema>
