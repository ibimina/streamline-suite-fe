'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Check,
  X,
  ArrowRight,
  HelpCircle,
  Zap,
  Building2,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import Link from 'next/link'

type PublicPage = 'home' | 'features' | 'pricing' | 'about' | 'contact' | 'login' | 'signup'

interface PricingPageProps {
  onNavigate: (page: PublicPage) => void
}

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for freelancers and small businesses just getting started',
    monthlyPrice: 5000,
    annualPrice: 48000,
    currency: '₦',
    features: [
      { name: 'Up to 50 invoices/month', included: true },
      { name: 'Up to 100 products', included: true },
      { name: 'Up to 50 customers', included: true },
      { name: 'Basic expense tracking', included: true },
      { name: 'Basic reports', included: true },
      { name: 'Email support', included: true },
      { name: '1 user', included: true },
      { name: 'Quotations', included: false },
      { name: 'Payroll management', included: false },
      { name: 'Inventory tracking', included: false },
      { name: 'Staff management', included: false },
      { name: 'Supplier management', included: false },
      { name: 'Tax reports', included: false },
      { name: 'Analytics dashboard', included: false },
    ],
    cta: 'Start Free Trial',
    popular: false,
    icon: Zap,
  },
  {
    name: 'Professional',
    description: 'For growing businesses that need more power and flexibility',
    monthlyPrice: 15000,
    annualPrice: 144000,
    currency: '₦',
    features: [
      { name: 'Unlimited invoices', included: true },
      { name: 'Unlimited products', included: true },
      { name: 'Unlimited customers', included: true },
      { name: 'Full expense management', included: true },
      { name: 'Advanced reports & analytics', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Up to 5 users', included: true },
      { name: 'Quotations', included: true },
      { name: 'Payroll management', included: true },
      { name: 'Inventory tracking', included: true },
      { name: 'Staff management', included: true },
      { name: 'Supplier management', included: true },
      { name: 'Tax reports', included: true },
      { name: 'Custom invoice templates', included: true },
    ],
    cta: 'Start Free Trial',
    popular: true,
    icon: Building2,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with advanced needs and dedicated support',
    monthlyPrice: 50000,
    annualPrice: 480000,
    currency: '₦',
    features: [
      { name: 'Unlimited everything', included: true },
      { name: 'Unlimited products', included: true },
      { name: 'Unlimited customers', included: true },
      { name: 'Full expense management', included: true },
      { name: 'Custom reports & analytics', included: true },
      { name: '24/7 phone support', included: true },
      { name: 'Unlimited users', included: true },
      { name: 'Quotations', included: true },
      { name: 'Payroll management', included: true },
      { name: 'Inventory tracking', included: true },
      { name: 'Staff management', included: true },
      { name: 'Supplier management', included: true },
      { name: 'Tax reports', included: true },
      { name: 'Custom invoice templates', included: true },
      { name: 'Dedicated account manager', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
    icon: Users,
  },
]

const faqs = [
  {
    question: 'Can I change my plan later?',
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences in billing.",
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, bank transfers, and mobile money payments including Paystack, Flutterwave, and direct bank transfers.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      "Yes! All plans come with a 14-day free trial. No credit card required to start. You'll only be charged after your trial ends if you decide to continue.",
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Absolutely. There are no long-term contracts or cancellation fees. You can cancel your subscription at any time from your account settings.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer:
      "Yes, you save 20% when you choose annual billing. That's like getting 2+ months free every year!",
  },
  {
    question: 'What happens to my data if I cancel?',
    answer:
      'Your data remains accessible for 30 days after cancellation. You can export all your data at any time. After 30 days, data is securely deleted.',
  },
]

const comparisonFeatures = [
  { name: 'Invoices', starter: '50/month', professional: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Products', starter: '100', professional: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Customers', starter: '50', professional: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Users', starter: '1', professional: '5', enterprise: 'Unlimited' },
  { name: 'Quotations', starter: false, professional: true, enterprise: true },
  { name: 'Inventory Management', starter: false, professional: true, enterprise: true },
  { name: 'Payroll', starter: false, professional: true, enterprise: true },
  { name: 'Expense Management', starter: 'Basic', professional: 'Full', enterprise: 'Full' },
  { name: 'Staff Management', starter: false, professional: true, enterprise: true },
  { name: 'Supplier Management', starter: false, professional: true, enterprise: true },
  { name: 'Tax Reports', starter: false, professional: true, enterprise: true },
  { name: 'Analytics Dashboard', starter: false, professional: true, enterprise: true },
  { name: 'Advanced Reports', starter: false, professional: true, enterprise: true },
  { name: 'API Access', starter: false, professional: true, enterprise: true },
  { name: 'Custom Invoice Templates', starter: false, professional: true, enterprise: true },
  { name: 'Priority Support', starter: false, professional: false, enterprise: true },
  { name: 'Dedicated Account Manager', starter: false, professional: false, enterprise: true },
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='border border-border rounded-xl overflow-hidden'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors'
      >
        <span className='font-medium text-foreground'>{question}</span>
        {isOpen ? (
          <ChevronUp className='h-5 w-5 text-muted-foreground' />
        ) : (
          <ChevronDown className='h-5 w-5 text-muted-foreground' />
        )}
      </button>
      {isOpen && (
        <div className='px-6 pb-6'>
          <p className='text-muted-foreground'>{answer}</p>
        </div>
      )}
    </div>
  )
}

const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <section className='relative py-20 overflow-hidden'>
        <div className='absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5' />
        <div className='container mx-auto px-4 relative'>
          <AnimatedSection>
            <div className='text-center max-w-3xl mx-auto'>
              <span className='inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6'>
                Simple, Transparent Pricing
              </span>
              <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
                Choose the Perfect Plan for <span className='text-primary'>Your Business</span>
              </h1>
              <p className='text-xl text-muted-foreground mb-8'>
                Start free for 14 days. No credit card required. Cancel anytime.
              </p>

              {/* Billing Toggle */}
              <div className='flex items-center justify-center gap-4'>
                <span
                  className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  Monthly
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative w-14 h-8 rounded-full transition-colors border-2 ${
                    isAnnual ? 'bg-primary border-primary' : 'bg-muted/50 border-border'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200 ${
                      isAnnual ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span
                  className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  Annual
                </span>
                {isAnnual && (
                  <span className='px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded-full'>
                    Save 20%
                  </span>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className='py-12'>
        <div className='container mx-auto px-4'>
          <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
            {plans.map(plan => (
              <AnimatedSection key={plan.name}>
                <div
                  className={`relative bg-card rounded-2xl border-2 transition-all hover:shadow-xl h-full flex flex-col ${
                    plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'
                  }`}
                >
                  {plan.popular && (
                    <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                      <span className='px-4 py-1 bg-primary text-white text-sm font-medium rounded-full'>
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className='p-8 flex-1 flex flex-col'>
                    <div className='flex items-center gap-3 mb-4'>
                      <div
                        className={`p-2 rounded-lg ${plan.popular ? 'bg-primary/10' : 'bg-muted'}`}
                      >
                        <plan.icon
                          className={`h-6 w-6 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`}
                        />
                      </div>
                      <h3 className='text-xl font-bold text-foreground'>{plan.name}</h3>
                    </div>

                    <p className='text-muted-foreground text-sm mb-6'>{plan.description}</p>

                    <div className='mb-6'>
                      <div className='flex items-baseline gap-1'>
                        <span className='text-2xl font-medium text-muted-foreground'>
                          {plan.currency}
                        </span>
                        <span className='text-5xl font-bold text-foreground'>
                          {(isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice).toLocaleString()}
                        </span>
                      </div>
                      <p className='text-muted-foreground text-sm mt-1'>
                        per month{isAnnual && ', billed annually'}
                      </p>
                      {isAnnual && (
                        <p className='text-green-600 dark:text-green-400 text-sm font-medium mt-1'>
                          Save {plan.currency}
                          {(plan.monthlyPrice * 12 - plan.annualPrice).toLocaleString()}/year
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onNavigate(plan.name === 'Enterprise' ? 'contact' : 'signup')}
                      className={`w-full mb-6 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold transition-all ${
                        plan.popular
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'border border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className='h-4 w-4' />
                    </button>

                    <ul className='space-y-3 flex-1'>
                      {plan.features.map((feature, i) => (
                        <li key={feature.name} className='flex items-center gap-3'>
                          {feature.included ? (
                            <Check className='h-5 w-5 text-green-500 shrink-0' />
                          ) : (
                            <X className='h-5 w-5 text-muted-foreground/50 shrink-0' />
                          )}
                          <span
                            className={
                              feature.included ? 'text-foreground' : 'text-muted-foreground'
                            }
                          >
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className='py-20 bg-muted/50'>
        <div className='container mx-auto px-4'>
          <AnimatedSection>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-foreground mb-4'>Compare Plans</h2>
              <p className='text-muted-foreground'>See what&apos;s included in each plan</p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className='max-w-4xl mx-auto bg-card rounded-2xl border border-border overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-border'>
                      <th className='text-left p-6 font-semibold text-foreground'>Feature</th>
                      <th className='text-center p-6 font-semibold text-foreground'>Starter</th>
                      <th className='text-center p-6 font-semibold text-primary bg-primary/5'>
                        Professional
                      </th>
                      <th className='text-center p-6 font-semibold text-foreground'>Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={feature.name} className='border-b border-border last:border-0'>
                        <td className='p-6 text-foreground'>{feature.name}</td>
                        <td className='p-6 text-center'>
                          {typeof feature.starter === 'boolean' ? (
                            feature.starter ? (
                              <Check className='h-5 w-5 text-green-500 mx-auto' />
                            ) : (
                              <X className='h-5 w-5 text-muted-foreground/50 mx-auto' />
                            )
                          ) : (
                            <span className='text-muted-foreground'>{feature.starter}</span>
                          )}
                        </td>
                        <td className='p-6 text-center bg-primary/5'>
                          {typeof feature.professional === 'boolean' ? (
                            feature.professional ? (
                              <Check className='h-5 w-5 text-green-500 mx-auto' />
                            ) : (
                              <X className='h-5 w-5 text-muted-foreground/50 mx-auto' />
                            )
                          ) : (
                            <span className='text-foreground font-medium'>
                              {feature.professional}
                            </span>
                          )}
                        </td>
                        <td className='p-6 text-center'>
                          {typeof feature.enterprise === 'boolean' ? (
                            feature.enterprise ? (
                              <Check className='h-5 w-5 text-green-500 mx-auto' />
                            ) : (
                              <X className='h-5 w-5 text-muted-foreground/50 mx-auto' />
                            )
                          ) : (
                            <span className='text-muted-foreground'>{feature.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <AnimatedSection>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-foreground mb-4'>
                Frequently Asked Questions
              </h2>
              <p className='text-muted-foreground'>Everything you need to know about our pricing</p>
            </div>
          </AnimatedSection>

          <div className='max-w-3xl mx-auto space-y-4'>
            {faqs.map((faq, index) => (
              <AnimatedSection key={faq.question}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-muted/50'>
        <div className='container mx-auto px-4'>
          <AnimatedSection>
            <div className='text-center max-w-2xl mx-auto'>
              <HelpCircle className='h-12 w-12 text-primary mx-auto mb-6' />
              <h2 className='text-2xl font-bold text-foreground mb-4'>Still have questions?</h2>
              <p className='text-muted-foreground mb-8'>
                Our team is here to help. Contact us for personalized assistance.
              </p>
              <button
                onClick={() => onNavigate('contact')}
                className='inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-base font-semibold text-foreground hover:bg-muted transition-all'
              >
                Contact Sales
                <ArrowRight className='h-5 w-5' />
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
