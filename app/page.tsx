'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Read the recovery code only in the browser so this page remains prerenderable.
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      router.replace(`/auth/reset-password?code=${encodeURIComponent(code)}`)
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8]">
        {/* Hero Section */}
        <main className="flex items-center justify-center px-4 py-6 md:py-12">
          <div className="w-full max-w-4xl space-y-8 md:space-y-12">
            <div className="text-center space-y-3 md:space-y-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#001f23] text-balance leading-tight">
                Master Annotation with Handshake
              </h1>
              <p className="text-sm md:text-lg lg:text-xl text-[#001f23]/80 max-w-2xl mx-auto text-pretty leading-relaxed">
                Join our comprehensive annotation training platform. Register, complete your international payment, and gain instant access to verified handshake accounts ready to task globally.
              </p>
              <div className="flex flex-col gap-3 md:gap-4 justify-center pt-2 md:pt-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full md:w-auto bg-[#001f23] text-white hover:bg-[#001f23]/90 text-sm md:text-base px-6 md:px-8">
                    Get Started
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="w-full md:w-auto border-[#001f23] text-[#001f23] hover:bg-white/50 text-sm md:text-base px-6 md:px-8">
                    Already Registered? Sign In
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="border-0 shadow-lg bg-white/95 backdrop-blur rounded-lg p-4 md:p-6 space-y-2 md:space-y-3">
                <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold text-[#001f23]">
                  <span className="text-xl md:text-2xl">✓</span>
                  Easy Registration
                </h3>
                <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                  Sign up with email and password. Confirm your email address to proceed.
                </p>
              </div>

              <div className="border-0 shadow-lg bg-white/95 backdrop-blur rounded-lg p-4 md:p-6 space-y-2 md:space-y-3">
                <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold text-[#001f23]">
                  <span className="text-xl md:text-2xl">💳</span>
                  International Payment
                </h3>
                <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                  Fast and secure payment via Paystack. Supports cards, mobile money, and bank transfers globally.
                </p>
              </div>

              <div className="border-0 shadow-lg bg-white/95 backdrop-blur rounded-lg p-4 md:p-6 space-y-2 md:space-y-3">
                <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold text-[#001f23]">
                  <span className="text-xl md:text-2xl">🎓</span>
                  Full Access
                </h3>
                <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                  Get verified by admin and receive access to all annotation training classes.
                </p>
              </div>
            </div>

            {/* Process Steps */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 md:p-8 shadow-lg">
              <h2 className="text-xl md:text-2xl font-bold text-[#001f23] mb-6 md:mb-8">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="text-center space-y-2 md:space-y-3">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-[#B8F663] to-[#59E4A0] flex items-center justify-center mx-auto">
                    <span className="text-base md:text-lg font-bold text-[#001f23]">1</span>
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-[#001f23]">Register</h4>
                  <p className="text-xs md:text-sm text-[#001f23]/70">Create account and confirm email</p>
                </div>
                <div className="text-center space-y-2 md:space-y-3">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-[#59E4A0] to-[#23DAC2] flex items-center justify-center mx-auto">
                    <span className="text-base md:text-lg font-bold text-[#001f23]">2</span>
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-[#001f23]">Sign In</h4>
                  <p className="text-xs md:text-sm text-[#001f23]/70">Log in to your dashboard</p>
                </div>
                <div className="text-center space-y-2 md:space-y-3">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-[#23DAC2] to-[#00D3D8] flex items-center justify-center mx-auto">
                    <span className="text-base md:text-lg font-bold text-[#001f23]">3</span>
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-[#001f23]">Pay $50 USD</h4>
                  <p className="text-xs md:text-sm text-[#001f23]/70">Fully refundable after 14 days</p>
                </div>
                <div className="text-center space-y-2 md:space-y-3">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-[#00D3D8] to-[#B8F663] flex items-center justify-center mx-auto">
                    <span className="text-base md:text-lg font-bold text-[#001f23]">4</span>
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-[#001f23]">Get Verified</h4>
                  <p className="text-xs md:text-sm text-[#001f23]/70">Admin verification and account activation</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Educational Content: What Is Data Annotation */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20 space-y-6">
          <div className="space-y-3">
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[#00A8AD]">Learn the fundamentals</span>
            <h2 className="text-2xl md:text-4xl font-bold text-[#001f23] text-balance">What Is Data Annotation and Why Does It Matter?</h2>
          </div>
          <div className="space-y-4 text-sm md:text-base text-[#001f23]/80 leading-relaxed">
            <p>
              Data annotation is the process of labeling raw information—images, text, audio, and video—so that machine learning
              models can understand and learn from it. Every time an artificial intelligence system recognizes a face in a photo,
              transcribes speech into text, or recommends the next video to watch, it relies on datasets that human annotators
              carefully prepared. Without accurate labels, even the most advanced algorithm has nothing meaningful to learn from.
            </p>
            <p>
              In practical terms, an annotator might draw boxes around cars in a street photo, mark which words in a sentence express
              a positive or negative sentiment, or classify whether a customer review is spam. These small, human decisions become the
              "ground truth" that models train on. High-quality annotation directly determines how reliable, fair, and safe an AI system
              becomes once it is deployed in the real world. This is why organizations invest heavily in well-trained annotators who
              understand both the task guidelines and the reasoning behind them.
            </p>
            <p>
              Handshake AI exists to help contributors build these skills from the ground up. Our training approach focuses on the
              judgment, consistency, and attention to detail that separate a beginner from a trusted professional. Whether you are new
              to remote work or looking to formalize experience you already have, understanding the fundamentals of annotation is the
              first step toward long-term, sustainable online tasking.
            </p>
          </div>
        </div>
      </section>

      {/* Types of Annotation Work */}
      <section className="bg-gradient-to-b from-white to-[#F1FBF4]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-4xl font-bold text-[#001f23]">Common Types of Data Annotation Work</h2>
            <p className="text-sm md:text-base text-[#001f23]/70 max-w-3xl mx-auto leading-relaxed">
              Annotation covers a wide range of task types across different data formats. Understanding these categories helps you
              choose the work that best matches your strengths and interests.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="border border-[#001f23]/10 shadow-sm bg-white rounded-lg p-5 md:p-6 space-y-2">
              <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Image Annotation</h3>
              <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                Labeling objects within images using bounding boxes, polygons, or pixel-level segmentation. Used to train computer
                vision systems for self-driving cars, medical imaging, and retail analytics.
              </p>
            </div>
            <div className="border border-[#001f23]/10 shadow-sm bg-white rounded-lg p-5 md:p-6 space-y-2">
              <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Text Annotation</h3>
              <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                Classifying sentiment, tagging named entities such as people and places, and marking intent in conversations. This
                work powers chatbots, search engines, and language translation tools.
              </p>
            </div>
            <div className="border border-[#001f23]/10 shadow-sm bg-white rounded-lg p-5 md:p-6 space-y-2">
              <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Audio Annotation</h3>
              <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                Transcribing spoken words, identifying speakers, and labeling sounds or emotions. Essential for voice assistants,
                call-center automation, and accessibility features.
              </p>
            </div>
            <div className="border border-[#001f23]/10 shadow-sm bg-white rounded-lg p-5 md:p-6 space-y-2">
              <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Video Annotation</h3>
              <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                Tracking objects frame by frame and labeling actions across time. Used in security, sports analytics, and autonomous
                navigation where movement and context matter.
              </p>
            </div>
            <div className="border border-[#001f23]/10 shadow-sm bg-white rounded-lg p-5 md:p-6 space-y-2">
              <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Sentiment &amp; Intent</h3>
              <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                Judging the tone and purpose behind messages, reviews, and social posts. Requires cultural awareness and careful
                reading to capture nuance that simple keyword matching misses.
              </p>
            </div>
            <div className="border border-[#001f23]/10 shadow-sm bg-white rounded-lg p-5 md:p-6 space-y-2">
              <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Data Categorization</h3>
              <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                Sorting content into structured categories, verifying information, and flagging quality issues. A foundational skill
                that applies across nearly every annotation project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills You Will Develop */}
      <section className="bg-[#F1FBF4]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-6">
          <h2 className="text-2xl md:text-4xl font-bold text-[#001f23]">Skills You Will Develop</h2>
          <p className="text-sm md:text-base text-[#001f23]/70 leading-relaxed max-w-3xl">
            Successful annotators combine technical familiarity with soft skills that employers value. Our training emphasizes the
            capabilities that lead to consistent, high-quality output and long-term opportunities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="flex gap-4">
              <span className="text-2xl text-[#00A8AD] flex-shrink-0">01</span>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Guideline Interpretation</h3>
                <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                  Reading project instructions closely and applying them consistently, even in ambiguous edge cases where judgment is required.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl text-[#00A8AD] flex-shrink-0">02</span>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Attention to Detail</h3>
                <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                  Spotting subtle differences and maintaining accuracy across hundreds of repetitive tasks without losing focus.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl text-[#00A8AD] flex-shrink-0">03</span>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Quality Assurance</h3>
                <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                  Reviewing your own work, understanding common error patterns, and meeting the accuracy thresholds projects demand.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl text-[#00A8AD] flex-shrink-0">04</span>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Time Management</h3>
                <p className="text-xs md:text-sm text-[#001f23]/70 leading-relaxed">
                  Balancing speed and quality to hit deadlines while keeping your throughput sustainable over long working sessions.
                </p>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <Link href="/guide">
              <Button size="lg" className="bg-[#001f23] text-white hover:bg-[#001f23]/90 text-sm md:text-base">
                Read the Full Annotation Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-4xl font-bold text-[#001f23]">Frequently Asked Questions</h2>
            <p className="text-sm md:text-base text-[#001f23]/70 max-w-2xl mx-auto leading-relaxed">
              Answers to the questions we hear most often from new and prospective members of the Handshake AI community.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-sm md:text-base font-semibold text-[#001f23]">
                What exactly does Handshake AI provide?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-[#001f23]/75 leading-relaxed">
                Handshake AI provides structured annotation training and access to verified, task-ready accounts. After you register,
                confirm your email, and complete the enrollment step, our team reviews your profile and activates your access so you
                can begin practicing and applying the skills covered in our training materials.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-sm md:text-base font-semibold text-[#001f23]">
                Do I need previous experience to get started?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-[#001f23]/75 leading-relaxed">
                No prior experience is required. Our training is designed for beginners and walks you through the fundamentals of data
                labeling, quality standards, and task workflows. Contributors with existing experience will also find value in the
                advanced guideline-interpretation and quality-assurance sections.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-sm md:text-base font-semibold text-[#001f23]">
                How does the enrollment fee work?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-[#001f23]/75 leading-relaxed">
                The one-time enrollment step is processed securely through Paystack, which supports cards, mobile money, and bank
                transfers. Your payment confirms your place in the program and unlocks the account verification process. Full details,
                including our refund window, are explained transparently during checkout and in our Terms of Service.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-sm md:text-base font-semibold text-[#001f23]">
                How long does verification take?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-[#001f23]/75 leading-relaxed">
                Most accounts are reviewed and verified within a short window after enrollment. Verification ensures that every active
                account meets our quality and security standards. You will receive a notification once your account has been activated
                and is ready to use.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-sm md:text-base font-semibold text-[#001f23]">
                Is my personal and payment information secure?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-[#001f23]/75 leading-relaxed">
                Yes. We use industry-standard encryption and never store your card details on our servers—payments are handled directly
                by Paystack, a certified payment processor. You can read exactly how we collect, use, and protect your data in our
                Privacy Policy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left text-sm md:text-base font-semibold text-[#001f23]">
                Where can I get help if I have a problem?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-[#001f23]/75 leading-relaxed">
                Our support team is available by email and typically responds within 24 hours. Visit the Contact page to send us a
                message about account verification, training access, or any other question. We are committed to helping every member
                succeed.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  )
}
