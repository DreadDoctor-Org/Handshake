import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-primary">Handshake</div>
            <div className="flex gap-4 items-center">
              <Link href="/auth/register">
                <Button variant="outline" size="sm">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="space-y-12">
          {/* Main Hero */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-pretty">
              <span className="text-primary">Handshake Annotation</span>
              <br />
              Access and Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Register and complete payment to access our comprehensive annotation tools. 
              We support both traditional card payments and cryptocurrency for your convenience.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 rounded-lg border border-border/50 bg-card hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Registration</h3>
              <p className="text-muted-foreground">
                Quick and simple registration process with just your email and password.
              </p>
            </div>

            <div className="p-8 rounded-lg border border-border/50 bg-card hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible Payments</h3>
              <p className="text-muted-foreground">
                Choose between credit card payments via Stripe or cryptocurrency transactions.
              </p>
            </div>

            <div className="p-8 rounded-lg border border-border/50 bg-card hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick Access</h3>
              <p className="text-muted-foreground">
                Instant payment confirmation and setup. Awaiting admin verification for final access.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-8">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Get Started Now
              </Button>
            </Link>
          </div>

          {/* Info Section */}
          <div className="mt-16 p-8 rounded-lg bg-card border border-border/50">
            <h2 className="text-2xl font-semibold mb-4">Payment Process</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-primary">1. Register Account</h3>
                <p className="text-muted-foreground">
                  Create your account with a username, email, and secure password.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-primary">2. Choose Payment Method</h3>
                <p className="text-muted-foreground">
                  Select your preferred payment option: Stripe card or cryptocurrency.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-primary">3. Complete Payment</h3>
                <p className="text-muted-foreground">
                  Process your payment securely through your chosen payment method.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-primary">4. Await Verification</h3>
                <p className="text-muted-foreground">
                  Admin verification completes your registration and grants full access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2024 Handshake Annotation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
