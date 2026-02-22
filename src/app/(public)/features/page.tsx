'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  FileText,
  Package,
  Users,
  BarChart3,
  Calculator,
  Wallet,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Globe,
} from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    id: 'invoicing',
    icon: FileText,
    title: 'Smart Invoicing',
    subtitle: 'Get paid faster',
    description:
      'Create professional invoices in under 60 seconds. Automatic payment reminders, multiple currency support, and real-time payment tracking.',
    benefits: [
      'Customizable invoice templates',
      'Automatic payment reminders',
      'Multiple currency support',
      'Payment tracking & reports',
      'Recurring invoices',
      'PDF & email delivery',
    ],
    stat: '80%',
    statLabel: 'faster invoice creation',
    color: 'bg-blue-500',
  },
  {
    id: 'inventory',
    icon: Package,
    title: 'Inventory Management',
    subtitle: 'Never run out of stock',
    description:
      'Track stock levels in real-time, set automatic reorder points, and manage multiple warehouses from one dashboard.',
    benefits: [
      'Real-time stock tracking',
      'Low stock alerts',
      'Barcode scanning',
      'Multiple warehouse support',
      'Purchase order management',
      'Stock movement history',
    ],
    stat: '50%',
    statLabel: 'reduction in stockouts',
    color: 'bg-emerald-500',
  },
  {
    id: 'payroll',
    icon: Wallet,
    title: 'Payroll Processing',
    subtitle: 'Pay your team on time',
    description:
      'Automate salary calculations, tax deductions, and bank transfers. Generate payslips and maintain compliance effortlessly.',
    benefits: [
      'Automatic tax calculations',
      'Bank transfer integration',
      'Payslip generation',
      'Leave management',
      'Overtime tracking',
      'Compliance reports',
    ],
    stat: '5hrs',
    statLabel: 'saved per pay cycle',
    color: 'bg-violet-500',
  },
  {
    id: 'customers',
    icon: Users,
    title: 'Customer Management',
    subtitle: 'Build lasting relationships',
    description:
      'Maintain a complete view of every customer. Track interactions, purchase history, and outstanding balances in one place.',
    benefits: [
      'Customer profiles',
      'Purchase history',
      'Outstanding balance tracking',
      'Communication logs',
      'Customer segmentation',
      'Import/export contacts',
    ],
    stat: '360°',
    statLabel: 'customer view',
    color: 'bg-amber-500',
  },
  {
    id: 'quotations',
    icon: Calculator,
    title: 'Quotations & Estimates',
    subtitle: 'Win more deals',
    description:
      'Create professional quotes quickly, track their status, and convert accepted quotes to invoices with one click.',
    benefits: [
      'Professional quote templates',
      'Quote-to-invoice conversion',
      'Expiry date tracking',
      'Approval workflows',
      'Version history',
      'E-signature support',
    ],
    stat: '35%',
    statLabel: 'higher conversion rate',
    color: 'bg-rose-500',
  },
  {
    id: 'reports',
    icon: BarChart3,
    title: 'Reports & Analytics',
    subtitle: 'Make data-driven decisions',
    description:
      'Get instant insights into your business performance. Revenue trends, expense breakdowns, and profitability analysis.',
    benefits: [
      'Revenue & expense reports',
      'Profit & loss statements',
      'Cash flow analysis',
      'Tax reports',
      'Custom date ranges',
      'Export to Excel/PDF',
    ],
    stat: 'Real-time',
    statLabel: 'business insights',
    color: 'bg-cyan-500',
  },
]

const additionalFeatures = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed. Every action completes in milliseconds.',
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: '256-bit encryption. Your data is protected 24/7.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: '99.9% uptime guarantee. Access your data anytime.',
  },
  {
    icon: Globe,
    title: 'Access Anywhere',
    description: 'Works on desktop, tablet, and mobile devices.',
  },
]

function AnimatedSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
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

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  )
}

const FeaturesPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <section className='relative py-20 overflow-hidden'>
        <div className='absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5' />
        <div className='container mx-auto px-6 sm:px-10 lg:px-16 relative'>
          <AnimatedSection>
            <div className='text-center max-w-3xl mx-auto'>
              <span className='inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6'>
                Powerful Features
              </span>
              <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
                Everything You Need to <span className='text-primary'>Run Your Business</span>
              </h1>
              <p className='text-xl text-muted-foreground mb-8'>
                From invoicing to payroll, inventory to analytics — all your business tools in one
                powerful platform.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link
                  href='/signup'
                  className='inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-primary/90 transition-all'
                >
                  Start Free Trial
                  <ArrowRight className='h-5 w-5' />
                </Link>
                <Link
                  href='/pricing'
                  className='inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-base font-semibold text-foreground hover:bg-muted transition-all'
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Detail Section */}
      <section className='py-20'>
        <div className='container mx-auto px-6 sm:px-10 lg:px-16'>
          {features.map((feature, index) => (
            <AnimatedSection key={feature.id}>
              <div
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-12 items-center mb-24 last:mb-0`}
              >
                {/* Content */}
                <div className='flex-1 space-y-6'>
                  <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted'>
                    <feature.icon className='h-4 w-4 text-primary' />
                    <span className='text-sm font-medium text-primary'>{feature.subtitle}</span>
                  </div>
                  <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
                    {feature.title}
                  </h2>
                  <p className='text-lg text-muted-foreground'>{feature.description}</p>

                  {/* Benefits List */}
                  <ul className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {feature.benefits.map((benefit, i) => (
                      <li key={benefit} className='flex items-center gap-2'>
                        <CheckCircle2 className='h-5 w-5 text-primary shrink-0' />
                        <span className='text-muted-foreground'>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Stat */}
                  <div className='flex items-center gap-4 pt-4'>
                    <div className='text-4xl font-bold text-primary'>{feature.stat}</div>
                    <div className='text-muted-foreground'>{feature.statLabel}</div>
                  </div>
                </div>

                {/* Mockup Placeholder */}
                <div className='flex-1 w-full'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-primary/10 rounded-2xl blur-3xl' />
                    <div className='relative bg-card border border-border rounded-2xl p-8 shadow-xl'>
                      <div className='aspect-video bg-muted rounded-lg flex items-center justify-center'>
                        <feature.icon className='h-16 w-16 text-muted-foreground/50' />
                      </div>
                      <p className='text-center text-sm text-muted-foreground mt-4'>
                        {feature.title} Preview
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className='py-20 bg-muted/50'>
        <div className='container mx-auto px-6 sm:px-10 lg:px-16'>
          <AnimatedSection>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-foreground mb-4'>Built for Reliability</h2>
              <p className='text-muted-foreground max-w-2xl mx-auto'>
                Enterprise-grade infrastructure that you can depend on
              </p>
            </div>
          </AnimatedSection>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {additionalFeatures.map(feature => (
              <AnimatedSection key={feature.title}>
                <div className='bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow'>
                  <div className='inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4'>
                    <feature.icon className='h-6 w-6 text-primary' />
                  </div>
                  <h3 className='font-semibold text-foreground mb-2'>{feature.title}</h3>
                  <p className='text-sm text-muted-foreground'>{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20'>
        <div className='container mx-auto px-6 sm:px-10 lg:px-16'>
          <AnimatedSection>
            <div className='relative overflow-hidden bg-linear-to-r from-primary to-primary/80 rounded-3xl p-12 text-center'>
              <div className='relative'>
                <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
                  Ready to Get Started?
                </h2>
                <p className='text-xl text-white/80 mb-8 max-w-2xl mx-auto'>
                  Join thousands of businesses already using Streamline Suite
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <Link
                    href='/signup'
                    className='inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-primary shadow-lg hover:bg-white/90 transition-all'
                  >
                    Start Your Free Trial
                    <ArrowRight className='h-5 w-5' />
                  </Link>
                  <Link
                    href='/contact-us'
                    className='inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all'
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

export default FeaturesPage
