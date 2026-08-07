'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    let active = true

    const establishRecoverySession = async () => {
      try {
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
        const accessToken = hash.get('access_token')
        const refreshToken = hash.get('refresh_token')

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) throw exchangeError
        } else if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (sessionError) throw sessionError
        }

        const { data, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (!data.session) throw new Error('This password reset link is invalid or expired.')

        if (active) setReady(true)
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'This password reset link is invalid or expired.')
      } finally {
        if (active) setChecking(false)
      }
    }

    establishRecoverySession()
    return () => {
      active = false
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }
    if (password !== confirmation) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      await supabase.auth.signOut()
      setMessage('Password updated successfully. Redirecting to sign in…')
      window.setTimeout(() => router.replace('/auth/login'), 1200)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update your password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{ready ? 'Create a new password' : 'Password recovery'}</CardTitle>
          <CardDescription>
            {checking ? 'Verifying your recovery link…' : ready ? 'Enter and confirm your new password.' : 'Request a new recovery link to continue.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {checking ? (
            <p className="text-sm text-muted-foreground">Please wait while we verify your link.</p>
          ) : ready ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium">New password</label>
                <Input id="new-password" type="password" minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={submitting} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">Confirm new password</label>
                <Input id="confirm-password" type="password" minLength={8} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={submitting} required />
              </div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
              <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Updating password…' : 'Update password'}</Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p role="alert" className="text-sm text-destructive">{error}</p>
              <Link href="/auth/forgot-password" className="block"><Button className="w-full">Request a new link</Button></Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
