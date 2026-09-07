import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'The Complete Guide to Data Annotation | Handshake AI',
  description:
    'A comprehensive, beginner-friendly guide to data annotation: what it is, the main task types, quality standards, tools, career paths, and practical tips for becoming a reliable annotator.',
}

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#B8F663] via-[#59E4A0] to-[#00D3D8] py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-[#001f23] text-balance">
              The Complete Guide to Data Annotation
            </h1>
            <p className="text-sm md:text-lg text-[#001f23]/80 max-w-2xl mx-auto text-pretty leading-relaxed">
              Everything a beginner needs to understand data labeling, quality standards, and how to build a dependable annotation
              workflow that AI teams trust.
            </p>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-12">
          {/* Table of Contents */}
          <Card className="border-0 shadow-lg bg-[#F1FBF4] p-6 md:p-8 space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-[#001f23]">In This Guide</h2>
            <ol className="list-decimal list-inside space-y-1 text-sm md:text-base text-[#001f23]/80">
              <li><a href="#introduction" className="hover:text-[#00A8AD] transition">Introduction to Data Annotation</a></li>
              <li><a href="#why-it-matters" className="hover:text-[#00A8AD] transition">Why Annotation Powers Modern AI</a></li>
              <li><a href="#task-types" className="hover:text-[#00A8AD] transition">The Main Types of Annotation Tasks</a></li>
              <li><a href="#quality" className="hover:text-[#00A8AD] transition">Understanding Quality Standards</a></li>
              <li><a href="#workflow" className="hover:text-[#00A8AD] transition">A Reliable Annotation Workflow</a></li>
              <li><a href="#tips" className="hover:text-[#00A8AD] transition">Practical Tips for New Annotators</a></li>
              <li><a href="#career" className="hover:text-[#00A8AD] transition">Building a Career in Annotation</a></li>
              <li><a href="#glossary" className="hover:text-[#00A8AD] transition">Glossary of Key Terms</a></li>
            </ol>
          </Card>

          {/* Introduction */}
          <section id="introduction" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">Introduction to Data Annotation</h2>
            <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
              Data annotation, also called data labeling, is the practice of adding meaningful tags to raw data so that computers can
              learn to recognize patterns. Machines do not naturally understand what a photograph contains or what a sentence means.
              They learn by studying thousands—sometimes millions—of examples that people have carefully labeled. Each label acts as a
              signpost, telling the model "this is a cat," "this review is negative," or "this word is a location."
            </p>
            <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
              The work sits at the intersection of human judgment and machine learning. While the tasks can look simple on the surface,
              the value comes from doing them consistently and accurately at scale. A single mislabeled example rarely matters, but
              systematic errors across a dataset can teach a model the wrong lesson entirely. That is why skilled annotators are in
              steady demand across industries as diverse as healthcare, automotive, finance, e-commerce, and social media.
            </p>
          </section>

          {/* Why it matters */}
          <section id="why-it-matters" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">Why Annotation Powers Modern AI</h2>
            <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
              Nearly every AI product you interact with depends on labeled data. Voice assistants were trained on transcribed speech.
              Photo apps that group faces relied on annotated images. Fraud-detection systems learned from transactions humans marked
              as legitimate or suspicious. In supervised machine learning—the most common approach in industry—the model is only ever
              as good as the labeled examples it studied.
            </p>
            <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
              This creates a direct link between annotation quality and real-world outcomes. In medical imaging, a carefully labeled
              dataset can help a model flag early signs of disease. In autonomous driving, precise object boundaries help a vehicle
              tell a pedestrian from a lamppost. Because the stakes can be high, teams build layered review processes and rely on
              annotators who understand not just the "what" of a task but the "why" behind each guideline.
            </p>
            <Card className="border-l-4 border-[#00A8AD] bg-[#F1FBF4] p-5 md:p-6">
              <p className="text-sm md:text-base text-[#001f23]/85 leading-relaxed italic">
                "Garbage in, garbage out" is one of the oldest sayings in computing—and nowhere is it more true than in machine
                learning. Clean, consistent labels are the foundation everything else is built on.
              </p>
            </Card>
          </section>

          {/* Task types */}
          <section id="task-types" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">The Main Types of Annotation Tasks</h2>
            <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
              Annotation projects vary widely, but most fall into a handful of recognizable categories. Getting comfortable with each
              helps you adapt quickly when you move between projects.
            </p>
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Classification</h3>
                <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
                  Assigning a whole item to a category—for example, marking an email as spam or not spam, or tagging a product photo
                  with the correct department. Classification is often the first task type new annotators learn.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Bounding Boxes and Segmentation</h3>
                <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
                  Drawing rectangles or precise outlines around objects in an image. Segmentation goes further by labeling every pixel,
                  which is critical for applications that need to understand exact shapes and boundaries.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Named Entity Recognition</h3>
                <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
                  Highlighting specific pieces of information inside text—names of people, organizations, dates, and places. This
                  underpins search, document processing, and information-extraction systems.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-semibold text-[#001f23]">Transcription and Sentiment</h3>
                <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
                  Converting audio into written text, or judging the emotional tone of a message. Both require careful attention to
                  context, slang, and cultural nuance that automated tools frequently miss.
                </p>
              </div>
            </div>
          </section>

          {/* Quality */}
          <section id="quality" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">Understanding Quality Standards</h2>
            <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
              Quality in annotation is measured in concrete ways. Teams often track <strong>accuracy</strong> (how often labels match
              the correct answer), <strong>consistency</strong> (whether the same input receives the same label across annotators), and
              <strong> throughput</strong> (how many items are completed in a given time). Strong annotators balance all three rather
              than sacrificing accuracy for speed.
            </p>
            <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
              A concept you will encounter often is <em>inter-annotator agreement</em>—a measure of how much different people agree when
              labeling the same data. High agreement suggests the guidelines are clear and being followed. When agreement drops, it
              usually signals that instructions need clarification or that a task contains genuinely ambiguous cases worth escalating
              to a reviewer.
            </p>
            <ul className="space-y-2 text-sm md:text-base text-[#001f23]/80">
              <li className="flex gap-3"><span className="text-[#00A8AD] flex-shrink-0">✓</span><span>Always read the full guidelines before starting, and revisit them when you hit an unusual case.</span></li>
              <li className="flex gap-3"><span className="text-[#00A8AD] flex-shrink-0">✓</span><span>Flag ambiguous items instead of guessing—your feedback improves the project for everyone.</span></li>
              <li className="flex gap-3"><span className="text-[#00A8AD] flex-shrink-0">✓</span><span>Review a sample of your own work periodically to catch drift before it becomes a habit.</span></li>
            </ul>
          </section>

          {/* Workflow */}
          <section id="workflow" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">A Reliable Annotation Workflow</h2>
            <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
              Consistency comes from routine. Experienced annotators tend to follow a repeatable loop that keeps quality high even
              during long sessions:
            </p>
            <ol className="space-y-3 text-sm md:text-base text-[#001f23]/80">
              <li className="flex gap-3"><span className="font-bold text-[#00A8AD] flex-shrink-0">1.</span><span><strong>Prepare:</strong> Re-read the guidelines and set up your workspace to minimize distractions.</span></li>
              <li className="flex gap-3"><span className="font-bold text-[#00A8AD] flex-shrink-0">2.</span><span><strong>Label:</strong> Work through items steadily, applying the rules the same way every time.</span></li>
              <li className="flex gap-3"><span className="font-bold text-[#00A8AD] flex-shrink-0">3.</span><span><strong>Verify:</strong> Double-check uncertain items and use any built-in validation tools.</span></li>
              <li className="flex gap-3"><span className="font-bold text-[#00A8AD] flex-shrink-0">4.</span><span><strong>Reflect:</strong> Note recurring questions and share them with your team lead or reviewer.</span></li>
            </ol>
          </section>

          {/* Tips */}
          <section id="tips" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">Practical Tips for New Annotators</h2>
            <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
              The difference between an average and an excellent annotator often comes down to small habits. Here are the ones that
              make the biggest difference early on:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border border-[#001f23]/10 bg-white p-5 space-y-2">
                <h3 className="text-base font-semibold text-[#001f23]">Start slow, then speed up</h3>
                <p className="text-sm text-[#001f23]/70 leading-relaxed">Accuracy first. Speed naturally follows once the guidelines become second nature.</p>
              </Card>
              <Card className="border border-[#001f23]/10 bg-white p-5 space-y-2">
                <h3 className="text-base font-semibold text-[#001f23]">Take short breaks</h3>
                <p className="text-sm text-[#001f23]/70 leading-relaxed">Fatigue is the enemy of consistency. Brief pauses keep your judgment sharp.</p>
              </Card>
              <Card className="border border-[#001f23]/10 bg-white p-5 space-y-2">
                <h3 className="text-base font-semibold text-[#001f23]">Keep a personal notes file</h3>
                <p className="text-sm text-[#001f23]/70 leading-relaxed">Record tricky cases and how you resolved them so you stay consistent over time.</p>
              </Card>
              <Card className="border border-[#001f23]/10 bg-white p-5 space-y-2">
                <h3 className="text-base font-semibold text-[#001f23]">Ask questions early</h3>
                <p className="text-sm text-[#001f23]/70 leading-relaxed">Clarifying a rule up front prevents dozens of mislabeled items later.</p>
              </Card>
            </div>
          </section>

          {/* Career */}
          <section id="career" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">Building a Career in Annotation</h2>
            <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
              Data annotation can be a flexible entry point into the wider world of technology and remote work. Many annotators begin
              with general labeling tasks and gradually specialize in areas such as medical data, natural-language processing, or
              quality review. Others move into roles like project coordination, guideline authoring, or team leadership as they build a
              track record of reliable work.
            </p>
            <p className="text-sm md:text-base text-[#001f23]/80 leading-relaxed">
              Because the demand for high-quality training data continues to grow alongside AI adoption, the skills you develop
              today—careful reading, consistency, and disciplined self-review—remain valuable across many future opportunities. Treat
              every project as a chance to strengthen your reputation, and that reputation becomes your most important asset.
            </p>
          </section>

          {/* Glossary */}
          <section id="glossary" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f23]">Glossary of Key Terms</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-base font-semibold text-[#001f23]">Ground Truth</dt>
                <dd className="text-sm md:text-base text-[#001f23]/70 leading-relaxed">The verified correct labels that a model is trained and evaluated against.</dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-[#001f23]">Supervised Learning</dt>
                <dd className="text-sm md:text-base text-[#001f23]/70 leading-relaxed">A training method where a model learns from examples that already include the correct answers.</dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-[#001f23]">Inter-Annotator Agreement</dt>
                <dd className="text-sm md:text-base text-[#001f23]/70 leading-relaxed">A metric describing how consistently different annotators label the same data.</dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-[#001f23]">Edge Case</dt>
                <dd className="text-sm md:text-base text-[#001f23]/70 leading-relaxed">An unusual or ambiguous example that guidelines may not clearly cover.</dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-[#001f23]">Throughput</dt>
                <dd className="text-sm md:text-base text-[#001f23]/70 leading-relaxed">The number of items an annotator completes within a set period of time.</dd>
              </div>
            </dl>
          </section>

          {/* CTA */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-[#B8F663] to-[#59E4A0] p-6 md:p-10 text-center space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-[#001f23]">Ready to Put These Skills Into Practice?</h2>
            <p className="text-sm md:text-base text-[#001f23]/85 leading-relaxed max-w-2xl mx-auto">
              Register with Handshake AI to begin your annotation training and work toward a verified, task-ready account.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto bg-[#001f23] text-white hover:bg-[#001f23]/90">Get Started</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#001f23] text-[#001f23] hover:bg-white/50">Contact Support</Button>
              </Link>
            </div>
          </Card>
        </article>
      </main>

      <Footer />
    </div>
  )
}
