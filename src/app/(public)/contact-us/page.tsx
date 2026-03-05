'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Headphones,
  FileQuestion,
  Building2,
  Send,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Our team typically responds within 24 hours',
    value: 'support@streamlinesuite.com',
    href: 'mailto:support@streamlinesuite.com',
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Mon-Fri from 8am to 6pm WAT',
    value: '+234 (0) 800 STREAM',
    href: 'tel:+2340800783726',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    description: 'Come say hello at our office',
    value: '15 Victoria Island, Lagos, Nigeria',
    href: '#',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    description: "We're here when you need us",
    value: 'Monday - Friday, 8am - 6pm WAT',
    href: '#',
  },
]

const inquiryTypes = [
  {
    icon: Headphones,
    title: 'Sales Inquiry',
    description: 'Learn how Streamline Suite can help your business grow.',
  },
  {
    icon: MessageSquare,
    title: 'Technical Support',
    description: 'Get help with any technical issues or questions.',
  },
  {
    icon: FileQuestion,
    title: 'General Question',
    description: 'Have a question about our features or pricing?',
  },
  {
    icon: Building2,
    title: 'Partnership',
    description: "Interested in partnering with us? Let's talk.",
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

const ContactPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    ;(e.target as HTMLFormElement).reset()
    setSelectedType(null)

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <section className='relative py-20 overflow-hidden'>
        <div className='absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5' />
        <div className='container mx-auto px-6 sm:px-10 lg:px-16 relative'>
          <AnimatedSection>
            <div className='text-center max-w-3xl mx-auto'>
              <span className='inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6'>
                Get in Touch
              </span>
              <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
                We&apos;d Love to Hear From You
              </h1>
              <p className='text-xl text-muted-foreground'>
                Have questions about our platform, pricing, or need help getting started? Our team
                is here to help you succeed.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Methods */}
      <section className='py-12 border-y border-border bg-muted/30'>
        <div className='container mx-auto px-6 sm:px-10 lg:px-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {contactMethods.map(method => (
              <AnimatedSection key={method.title}>
                <a
                  href={method.href}
                  className='block bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group'
                >
                  <div className='inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 group-hover:bg-primary/20 transition-colors'>
                    <method.icon className='h-6 w-6 text-primary' />
                  </div>
                  <h3 className='text-lg font-semibold text-foreground mb-1'>{method.title}</h3>
                  <p className='text-sm text-muted-foreground mb-2'>{method.description}</p>
                  <p className='text-primary font-medium text-sm'>{method.value}</p>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className='py-20'>
        <div className='container mx-auto px-6 sm:px-10 lg:px-16'>
          <div className='grid lg:grid-cols-2 gap-12 items-start'>
            {/* Inquiry Types */}
            <AnimatedSection>
              <div>
                <span className='inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4'>
                  How Can We Help?
                </span>
                <h2 className='text-3xl font-bold text-foreground mb-6'>
                  Choose Your Inquiry Type
                </h2>
                <p className='text-lg text-muted-foreground mb-8'>
                  Select the type of inquiry below to help us route your message to the right team
                  for a faster response.
                </p>

                <div className='grid sm:grid-cols-2 gap-4 mb-8'>
                  {inquiryTypes.map(type => (
                    <button
                      key={type.title}
                      onClick={() => setSelectedType(type.title)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        selectedType === type.title
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border bg-card hover:border-primary/30 hover:shadow-sm'
                      }`}
                    >
                      <div className='flex items-start gap-3'>
                        <div
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
                            selectedType === type.title ? 'bg-primary/20' : 'bg-muted'
                          }`}
                        >
                          <type.icon
                            className={`h-5 w-5 ${
                              selectedType === type.title ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className='font-semibold text-foreground mb-1'>{type.title}</h3>
                          <p className='text-sm text-muted-foreground'>{type.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* FAQ Link */}
                <div className='bg-muted/50 rounded-xl p-6'>
                  <h3 className='font-semibold text-foreground mb-2'>Looking for quick answers?</h3>
                  <p className='text-muted-foreground mb-4'>
                    Check out our pricing page for frequently asked questions about features and
                    plans.
                  </p>
                  <Link
                    href='/pricing'
                    className='inline-flex items-center gap-2 text-primary font-medium hover:underline'
                  >
                    View FAQs
                    <ArrowRight className='h-4 w-4' />
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection>
              <div className='bg-card border border-border rounded-2xl p-8 shadow-lg'>
                {isSubmitted ? (
                  <div className='text-center py-12'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6'>
                      <CheckCircle2 className='h-8 w-8 text-green-600' />
                    </div>
                    <h3 className='text-2xl font-bold text-foreground mb-2'>Message Sent!</h3>
                    <p className='text-muted-foreground mb-6'>
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className='text-primary font-medium hover:underline'
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className='text-2xl font-bold text-foreground mb-2'>Send Us a Message</h3>
                    <p className='text-muted-foreground mb-6'>
                      Fill out the form below and we&apos;ll respond as soon as possible.
                    </p>

                    <form onSubmit={handleSubmit} className='space-y-5'>
                      <div className='grid sm:grid-cols-2 gap-4'>
                        <div>
                          <label
                            htmlFor='firstName'
                            className='block text-sm font-medium text-foreground mb-2'
                          >
                            First Name *
                          </label>
                          <input
                            type='text'
                            id='firstName'
                            name='firstName'
                            required
                            className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all'
                            placeholder='John'
                          />
                        </div>
                        <div>
                          <label
                            htmlFor='lastName'
                            className='block text-sm font-medium text-foreground mb-2'
                          >
                            Last Name *
                          </label>
                          <input
                            type='text'
                            id='lastName'
                            name='lastName'
                            required
                            className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all'
                            placeholder='Doe'
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor='email'
                          className='block text-sm font-medium text-foreground mb-2'
                        >
                          Email Address *
                        </label>
                        <input
                          type='email'
                          id='email'
                          name='email'
                          required
                          className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all'
                          placeholder='john@company.com'
                        />
                      </div>

                      <div>
                        <label
                          htmlFor='company'
                          className='block text-sm font-medium text-foreground mb-2'
                        >
                          Company Name
                        </label>
                        <input
                          type='text'
                          id='company'
                          name='company'
                          className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all'
                          placeholder='Your Company Ltd.'
                        />
                      </div>

                      <div>
                        <label
                          htmlFor='inquiryType'
                          className='block text-sm font-medium text-foreground mb-2'
                        >
                          Inquiry Type *
                        </label>
                        <select
                          id='inquiryType'
                          name='inquiryType'
                          required
                          value={selectedType || ''}
                          onChange={e => setSelectedType(e.target.value)}
                          className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all'
                        >
                          <option value=''>Select an option</option>
                          {inquiryTypes.map(type => (
                            <option key={type.title} value={type.title}>
                              {type.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor='message'
                          className='block text-sm font-medium text-foreground mb-2'
                        >
                          Your Message *
                        </label>
                        <textarea
                          id='message'
                          name='message'
                          rows={5}
                          required
                          className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none'
                          placeholder='Tell us how we can help you...'
                        ></textarea>
                      </div>

                      <button
                        type='submit'
                        disabled={isSubmitting}
                        className='w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed'
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className='animate-spin h-5 w-5'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                            >
                              <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                              ></circle>
                              <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                              ></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className='h-5 w-5' />
                          </>
                        )}
                      </button>

                      <p className='text-sm text-muted-foreground text-center'>
                        By submitting this form, you agree to our{' '}
                        <a href='#' className='text-primary hover:underline'>
                          Privacy Policy
                        </a>
                      </p>
                    </form>
                  </>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-muted/50'>
        <div className='container mx-auto px-6 sm:px-10 lg:px-16'>
          <AnimatedSection>
            <div className='text-center max-w-3xl mx-auto'>
              <h2 className='text-3xl font-bold text-foreground mb-4'>
                Not Ready to Reach Out Yet?
              </h2>
              <p className='text-lg text-muted-foreground mb-8'>
                Explore our platform and see how Streamline Suite can transform your business
                operations.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link
                  href='/features'
                  className='inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-primary/90 transition-all'
                >
                  Explore Features
                  <ArrowRight className='h-5 w-5' />
                </Link>
                <Link
                  href='/pricing'
                  className='inline-flex items-center justify-center rounded-lg border border-border px-8 py-4 text-base font-semibold text-foreground hover:bg-muted transition-all'
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
