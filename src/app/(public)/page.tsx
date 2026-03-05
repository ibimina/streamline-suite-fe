'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
  FileText,
  Package,
  Users,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Play,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'

type PublicPage = 'home' | 'features' | 'pricing' | 'about' | 'contact' | 'login' | 'signup'

interface LandingPageProps {
  onNavigate: (page: PublicPage) => void
}

// Animation hook for scroll-based fade in
const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// Animated Section wrapper
const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const { ref, isVisible } = useScrollAnimation()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  )
}

// Trust Stats
const stats = [
  { value: '5,000+', label: 'Businesses' },
  { value: '₦2B+', label: 'Invoices Processed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'Rating' },
]

// Pain points
const painPoints = [
  'Losing track of unpaid invoices',
  'Manual inventory counting errors',
  'Scattered customer information',
  'Time-consuming payroll calculations',
]

// Solutions
const solutions = [
  'Automatic payment reminders',
  'Real-time stock tracking',
  'Centralized customer database',
  'One-click payroll processing',
]

// Features
const features = [
  {
    icon: FileText,
    title: 'Professional Invoicing',
    description:
      'Create beautiful, branded invoices in seconds. Track payments, send reminders, and get paid faster.',
    highlights: ['Custom templates', 'Auto-reminders', 'Payment tracking'],
  },
  {
    icon: Package,
    title: 'Smart Inventory',
    description:
      'Never run out of stock again. Real-time tracking, low-stock alerts, and automatic updates on every sale.',
    highlights: ['Low-stock alerts', 'Barcode scanning', 'Multi-location'],
  },
  {
    icon: Users,
    title: 'Team & Payroll',
    description:
      'Manage your entire team from one dashboard. Track attendance, process payroll, and handle deductions.',
    highlights: ['Easy onboarding', 'Payroll automation', 'Leave management'],
  },
]

// How it works steps
const steps = [
  {
    number: '01',
    title: 'Sign Up in 2 Minutes',
    description: 'Create your account and set up your business profile. No credit card required.',
  },
  {
    number: '02',
    title: 'Add Your Data',
    description: 'Import your customers, products, and team members. We make migration easy.',
  },
  {
    number: '03',
    title: 'Start Growing',
    description: 'Send your first invoice, track your inventory, and watch your business thrive.',
  },
]

// Testimonials
const testimonials = [
  {
    quote:
      "Streamline Suite cut our invoicing time by 80%. We used to spend hours on paperwork, now it's just minutes.",
    author: 'Adaora Okonkwo',
    role: 'CEO, Lagos Fashion House',
    rating: 5,
  },
  {
    quote:
      "The inventory tracking alone has saved us thousands. No more overselling or stockouts. It's a game changer.",
    author: 'Emeka Nwosu',
    role: 'Owner, TechMart Electronics',
    rating: 5,
  },
  {
    quote:
      'Managing payroll for 50+ employees was a nightmare. Now I do it in one click. Best investment for my business.',
    author: 'Fatima Ibrahim',
    role: 'HR Manager, Swift Logistics',
    rating: 5,
  },
]

// Pricing plans
const pricingPlans = [
  {
    name: 'Starter',
    price: '₦5,000',
    period: '/month',
    description: 'Perfect for freelancers and small businesses',
    features: [
      'Up to 50 invoices/month',
      'Basic inventory (100 items)',
      '1 team member',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: '₦15,000',
    period: '/month',
    description: 'For growing businesses that need more power',
    features: [
      'Unlimited invoices',
      'Advanced inventory (1,000 items)',
      'Up to 10 team members',
      'Payroll management',
      'Priority support',
      'Custom templates',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '₦50,000',
    period: '/month',
    description: 'For large organizations with complex needs',
    features: [
      'Everything in Professional',
      'Unlimited inventory',
      'Unlimited team members',
      'Multi-branch support',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className='overflow-hidden'>
      {/* Hero Section */}
      <section className='relative isolate px-6 pt-14 lg:px-8'>
        {/* Background linear */}
        <div
          className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
          aria-hidden='true'
        >
          <div
            className='relative left-1/2 aspect-1155/678 w-xl -translate-x-1/2 rotate-30 bg-linear-to-tr from-primary to-primary/50 opacity-20 sm:left-[calc(50%-30rem)] sm:w-6xl'
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className='mx-auto max-w-7xl py-24 sm:py-32 lg:py-40'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            {/* Left: Copy */}
            <div className='text-center lg:text-left'>
              <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6'>
                <Zap className='w-4 h-4' />
                Trusted by 5,000+ African businesses
              </div>
              <h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl'>
                Run Your Business,
                <span className='text-primary'> Not Your Paperwork</span>
              </h1>
              <p className='mt-6 text-lg leading-8 text-muted-foreground max-w-xl'>
                Create professional invoices in seconds, track inventory in real-time, and pay your
                team on time — all from one simple dashboard.{' '}
                <span className='font-medium text-foreground'>No spreadsheets. No headaches.</span>
              </p>
              <div className='mt-10 flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center'>
                <button
                  onClick={() => onNavigate('signup')}
                  className='w-full sm:w-auto rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl flex items-center justify-center gap-2'
                >
                  Start Free Trial
                  <ArrowRight className='w-4 h-4' />
                </button>
                <button
                  onClick={() => onNavigate('features')}
                  className='w-full sm:w-auto rounded-lg border border-border px-6 py-3 text-base font-semibold text-foreground hover:bg-muted transition-all flex items-center justify-center gap-2'
                >
                  <Play className='w-4 h-4' />
                  Watch Demo
                </button>
              </div>
              <p className='mt-4 text-sm text-muted-foreground'>
                14-day free trial • No credit card required
              </p>
            </div>

            {/* Right: Product Mockup */}
            <div className='relative'>
              <div className='relative rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 p-2 shadow-2xl'>
                <div className='rounded-xl bg-card border border-border overflow-hidden'>
                  {/* Browser chrome */}
                  <div className='flex items-center gap-2 px-4 py-3 bg-muted border-b border-border'>
                    <div className='flex gap-1.5'>
                      <div className='w-3 h-3 rounded-full bg-red-400' />
                      <div className='w-3 h-3 rounded-full bg-yellow-400' />
                      <div className='w-3 h-3 rounded-full bg-green-400' />
                    </div>
                    <div className='flex-1 mx-4'>
                      <div className='bg-background rounded px-3 py-1 text-xs text-muted-foreground'>
                        app.streamlinesuite.com/dashboard
                      </div>
                    </div>
                  </div>
                  {/* Dashboard preview */}
                  <div className='p-6 space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm text-muted-foreground'>Total Revenue</p>
                        <p className='text-2xl font-bold text-foreground'>₦2,450,000</p>
                      </div>
                      <div className='flex items-center gap-1 text-green-500 text-sm'>
                        <TrendingUp className='w-4 h-4' />
                        +12.5%
                      </div>
                    </div>
                    <div className='grid grid-cols-3 gap-3'>
                      {[
                        { label: 'Invoices', value: '24' },
                        { label: 'Products', value: '156' },
                        { label: 'Customers', value: '89' },
                      ].map(item => (
                        <div key={item.label} className='bg-muted rounded-lg p-3 text-center'>
                          <p className='text-lg font-semibold text-foreground'>{item.value}</p>
                          <p className='text-xs text-muted-foreground'>{item.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className='h-24 bg-linear-to-r from-primary/20 via-primary/10 to-transparent rounded-lg flex items-end px-2 pb-2'>
                      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div
                          key={h}
                          className='flex-1 mx-0.5 bg-primary rounded-t'
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className='absolute -top-4 -right-4 bg-card rounded-lg shadow-lg border border-border p-3 animate-bounce'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center'>
                    <Check className='w-4 h-4 text-green-600' />
                  </div>
                  <div>
                    <p className='text-xs font-medium text-foreground'>Payment Received</p>
                    <p className='text-xs text-muted-foreground'>₦125,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Stats */}
          <div className='mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-12'>
            {stats.map(stat => (
              <div key={stat.label} className='text-center'>
                <p className='text-3xl font-bold text-primary'>{stat.value}</p>
                <p className='text-sm text-muted-foreground mt-1'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Logos */}
      <section className='border-y border-border bg-muted/50 py-12'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <p className='text-center text-sm font-medium text-muted-foreground mb-8'>
            TRUSTED BY BUSINESSES ACROSS AFRICA
          </p>
          <div className='flex flex-wrap items-center justify-center gap-x-12 gap-y-6'>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className='h-8 w-24 bg-muted-foreground/20 rounded animate-pulse'
                title={`Customer logo ${i}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <AnimatedSection>
        <section className='py-24 sm:py-32 bg-background'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
                Still Using Spreadsheets?
              </h2>
              <p className='mt-4 text-lg text-muted-foreground max-w-2xl mx-auto'>
                We get it. Managing a business is hard enough without juggling multiple tools.
                Here&apos;s how Streamline Suite changes everything.
              </p>
            </div>

            <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
              {/* Before */}
              <div className='bg-red-50 dark:bg-red-950/20 rounded-2xl p-8 border border-red-200 dark:border-red-900'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center'>
                    <X className='w-5 h-5 text-red-600' />
                  </div>
                  <h3 className='text-xl font-semibold text-foreground'>Before Streamline</h3>
                </div>
                <ul className='space-y-4'>
                  {painPoints.map((point, i) => (
                    <li key={point} className='flex items-start gap-3'>
                      <X className='w-5 h-5 text-red-500 mt-0.5 shrink-0' />
                      <span className='text-muted-foreground'>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* After */}
              <div className='bg-green-50 dark:bg-green-950/20 rounded-2xl p-8 border border-green-200 dark:border-green-900'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center'>
                    <Check className='w-5 h-5 text-green-600' />
                  </div>
                  <h3 className='text-xl font-semibold text-foreground'>After Streamline</h3>
                </div>
                <ul className='space-y-4'>
                  {solutions.map((solution, i) => (
                    <li key={solution} className='flex items-start gap-3'>
                      <Check className='w-5 h-5 text-green-500 mt-0.5 shrink-0' />
                      <span className='text-muted-foreground'>{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection>
        <section className='py-24 sm:py-32 bg-muted/30'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='text-center mb-16'>
              <p className='text-primary font-semibold mb-2'>POWERFUL FEATURES</p>
              <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
                Everything You Need to Grow
              </h2>
              <p className='mt-4 text-lg text-muted-foreground max-w-2xl mx-auto'>
                From invoicing to inventory, payroll to analytics — we&apos;ve got you covered.
              </p>
            </div>

            <div className='grid md:grid-cols-3 gap-8'>
              {features.map(feature => (
                <div
                  key={feature.title}
                  className='bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow group'
                >
                  <div className='w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors'>
                    <feature.icon className='w-7 h-7 text-primary' />
                  </div>
                  <h3 className='text-xl font-semibold text-foreground mb-3'>{feature.title}</h3>
                  <p className='text-muted-foreground mb-6'>{feature.description}</p>
                  <ul className='space-y-2'>
                    {feature.highlights.map(highlight => (
                      <li key={highlight} className='flex items-center gap-2 text-sm'>
                        <Check className='w-4 h-4 text-primary' />
                        <span className='text-muted-foreground'>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className='text-center mt-12'>
              <button
                onClick={() => onNavigate('features')}
                className='inline-flex items-center gap-2 text-primary font-semibold hover:underline'
              >
                See all features
                <ArrowRight className='w-4 h-4' />
              </button>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* How It Works */}
      <AnimatedSection>
        <section className='py-24 sm:py-32 bg-background'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='text-center mb-16'>
              <p className='text-primary font-semibold mb-2'>GET STARTED IN MINUTES</p>
              <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
                How It Works
              </h2>
            </div>

            <div className='grid md:grid-cols-3 gap-8 relative'>
              {/* Connector line */}
              <div className='hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-linear-to-r from-primary via-primary to-primary/30' />

              {steps.map(step => (
                <div key={step.number} className='text-center relative'>
                  <div className='w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 relative z-10'>
                    <span className='text-3xl font-bold text-primary'>{step.number}</span>
                  </div>
                  <h3 className='text-xl font-semibold text-foreground mb-3'>{step.title}</h3>
                  <p className='text-muted-foreground'>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection>
        <section className='py-24 sm:py-32 bg-muted/30'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='text-center mb-16'>
              <p className='text-primary font-semibold mb-2'>TESTIMONIALS</p>
              <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
                Loved by Business Owners
              </h2>
            </div>

            <div className='grid md:grid-cols-3 gap-8'>
              {testimonials.map(testimonial => (
                <div
                  key={testimonial.author}
                  className='bg-card rounded-2xl p-8 shadow-lg border border-border'
                >
                  <div className='flex gap-1 mb-4'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={_} className='w-5 h-5 fill-yellow-400 text-yellow-400' />
                    ))}
                  </div>
                  <p className='text-foreground mb-6 italic'>&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center'>
                      <span className='text-primary font-semibold'>
                        {testimonial.author
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <p className='font-semibold text-foreground'>{testimonial.author}</p>
                      <p className='text-sm text-muted-foreground'>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Pricing Preview */}
      <AnimatedSection>
        <section className='py-24 sm:py-32 bg-background'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='text-center mb-16'>
              <p className='text-primary font-semibold mb-2'>SIMPLE PRICING</p>
              <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
                Choose Your Plan
              </h2>
              <p className='mt-4 text-lg text-muted-foreground'>
                Start free, upgrade when you&apos;re ready. No hidden fees.
              </p>
            </div>

            <div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
              {pricingPlans.map(plan => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-8 border ${
                    plan.popular
                      ? 'bg-primary text-white border-primary shadow-2xl scale-105'
                      : 'bg-card border-border shadow-lg'
                  }`}
                >
                  {plan.popular && (
                    <span className='inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-4'>
                      MOST POPULAR
                    </span>
                  )}
                  <h3
                    className={`text-xl font-semibold ${plan.popular ? 'text-white' : 'text-foreground'}`}
                  >
                    {plan.name}
                  </h3>
                  <div className='mt-4 mb-2'>
                    <span
                      className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-foreground'}`}
                    >
                      {plan.price}
                    </span>
                    <span className={plan.popular ? 'text-white/70' : 'text-muted-foreground'}>
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className={`text-sm mb-6 ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}
                  >
                    {plan.description}
                  </p>
                  <ul className='space-y-3 mb-8'>
                    {plan.features.map(feature => (
                      <li key={feature} className='flex items-start gap-2 text-sm'>
                        <Check
                          className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? 'text-white' : 'text-primary'}`}
                        />
                        <span className={plan.popular ? 'text-white/90' : 'text-muted-foreground'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onNavigate(plan.name === 'Enterprise' ? 'contact' : 'signup')}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? 'bg-white text-primary hover:bg-white/90'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Final CTA */}
      <section className='py-24 sm:py-32 bg-linear-to-br from-primary to-primary/80'>
        <div className='mx-auto max-w-4xl px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
            Ready to Simplify Your Business?
          </h2>
          <p className='mt-6 text-lg text-white/80 max-w-2xl mx-auto'>
            Join thousands of business owners who save hours every week with Streamline Suite. Start
            your free trial today — no credit card required.
          </p>
          <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
            <button
              onClick={() => onNavigate('signup')}
              className='w-full sm:w-auto rounded-lg bg-white px-8 py-4 text-base font-semibold text-primary shadow-lg hover:bg-white/90 transition-all flex items-center justify-center gap-2'
            >
              Start Your Free Trial
              <ArrowRight className='w-4 h-4' />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className='w-full sm:w-auto rounded-lg border-2 border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all'
            >
              Talk to Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
