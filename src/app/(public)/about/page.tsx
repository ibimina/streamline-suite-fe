'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  Target,
  Eye,
  Heart,
  TrendingUp,
  Globe,
  Linkedin,
  Twitter,
  ArrowRight,
  CheckCircle2,
  Award,
  Users,
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  { value: '5,000+', label: 'Businesses Trust Us' },
  { value: '₦2B+', label: 'Invoices Processed' },
  { value: '50,000+', label: 'Users Worldwide' },
  { value: '99.9%', label: 'Uptime Guarantee' },
]

const values = [
  {
    icon: Target,
    title: 'Customer First',
    description: 'Every decision we make starts with our customers. Your success is our success.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description:
      'No hidden fees, no surprises. We believe in clear communication and honest pricing.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description:
      "We're passionate about helping businesses thrive. It's not just work, it's our mission.",
  },
  {
    icon: TrendingUp,
    title: 'Innovation',
    description:
      'We constantly improve and innovate to bring you the best tools for your business.',
  },
]

const team = [
  {
    name: 'Adebayo Johnson',
    role: 'CEO & Co-Founder',
    bio: 'Former fintech executive with 15+ years experience building financial products across Africa.',
  },
  {
    name: 'Chiamaka Obi',
    role: 'CTO & Co-Founder',
    bio: 'Engineering leader who previously built scalable systems at major tech companies.',
  },
  {
    name: 'Emeka Nwosu',
    role: 'Head of Product',
    bio: 'Product expert focused on creating intuitive experiences that businesses love.',
  },
  {
    name: 'Fatima Abubakar',
    role: 'Head of Customer Success',
    bio: 'Dedicated to ensuring every customer achieves their business goals with our platform.',
  },
]

const timeline = [
  {
    year: '2020',
    title: 'The Beginning',
    description: 'Founded with a mission to simplify business management for African SMEs.',
  },
  {
    year: '2021',
    title: 'First 1,000 Customers',
    description: 'Reached our first major milestone and launched inventory management.',
  },
  {
    year: '2022',
    title: 'Payroll Launch',
    description: 'Added payroll management, becoming a complete business suite.',
  },
  {
    year: '2023',
    title: 'Series A Funding',
    description: 'Raised funding to expand across Africa and enhance our platform.',
  },
  {
    year: '2024',
    title: '5,000+ Businesses',
    description: 'Trusted by thousands of businesses processing billions in transactions.',
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

const AboutUsPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <section className='relative py-20 overflow-hidden'>
        <div className='absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5' />
        <div className='container mx-auto px-6 sm:px-10 lg:px-16 relative'>
          <AnimatedSection>
            <div className='text-center max-w-3xl mx-auto'>
              <span className='inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6'>
                Our Story
              </span>
              <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
                Building the Future of <span className='text-primary'>Business Management</span>
              </h1>
              <p className='text-xl text-muted-foreground'>
                We&apos;re on a mission to empower businesses across Africa with simple, powerful
                tools that help them grow and succeed.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-12 border-y border-border bg-muted/30'>
        <div className='container mx-auto px-6 sm:px-10 lg:px-16'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {stats.map(stat => (
              <AnimatedSection key={stat.label}>
                <div className='text-center'>
                  <div className='text-3xl md:text-4xl font-bold text-primary mb-2'>
                    {stat.value}
                  </div>
                  <div className='text-muted-foreground'>{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className='py-20'>
        <div className='container mx-auto px-6 sm:px-10 lg:px-16'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <AnimatedSection>
              <div>
                <span className='inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4'>
                  Our Mission
                </span>
                <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-6'>
                  Empowering Businesses to Thrive
                </h2>
                <p className='text-lg text-muted-foreground mb-6'>
                  We believe that every business, regardless of size, deserves access to powerful
                  tools that were once only available to large enterprises. Our mission is to
                  democratize business management software.
                </p>
                <ul className='space-y-4'>
                  {[
                    'Make business management accessible to everyone',
                    'Help African businesses compete globally',
                    'Reduce administrative burden so owners can focus on growth',
                    'Provide enterprise-grade tools at affordable prices',
                  ].map(item => (
                    <li key={item} className='flex items-start gap-3'>
                      <CheckCircle2 className='h-6 w-6 text-primary shrink-0 mt-0.5' />
                      <span className='text-foreground'>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className='relative'>
                <div className='absolute inset-0 bg-primary/20 rounded-3xl blur-3xl' />
                <div className='relative bg-card border border-border rounded-3xl p-8 shadow-xl'>
                  <div className='aspect-video bg-muted rounded-xl flex items-center justify-center'>
                    <Globe className='h-20 w-20 text-muted-foreground/30' />
                  </div>
                  <p className='text-center text-muted-foreground mt-4'>
                    Serving businesses across Africa
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className='py-20 bg-muted/50'>
        <div className='container mx-auto px-6 sm:px-10 lg:px-16'>
          <AnimatedSection>
            <div className='text-center mb-12'>
              <span className='inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4'>
                Our Values
              </span>
              <h2 className='text-3xl font-bold text-foreground mb-4'>What We Stand For</h2>
              <p className='text-muted-foreground max-w-2xl mx-auto'>
                These core values guide everything we do, from product development to customer
                support.
              </p>
            </div>
          </AnimatedSection>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {values.map(value => (
              <AnimatedSection key={value.title}>
                <div className='bg-card border border-border rounded-xl p-6 h-full hover:shadow-lg transition-shadow'>
                  <div className='inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4'>
                    <value.icon className='h-6 w-6 text-primary' />
                  </div>
                  <h3 className='text-lg font-semibold text-foreground mb-2'>{value.title}</h3>
                  <p className='text-muted-foreground'>{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className='py-20'>
        <div className='container mx-auto px-6 sm:px-10 lg:px-16'>
          <AnimatedSection>
            <div className='text-center mb-12'>
              <span className='inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4'>
                Our Journey
              </span>
              <h2 className='text-3xl font-bold text-foreground mb-4'>
                The Streamline Suite Story
              </h2>
            </div>
          </AnimatedSection>

          <div className='max-w-3xl mx-auto'>
            {timeline.map((item, index) => (
              <AnimatedSection key={item.year}>
                <div className='flex gap-6 mb-8 last:mb-0'>
                  <div className='flex flex-col items-center'>
                    <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm'>
                      {item.year.slice(2)}
                    </div>
                    {index < timeline.length - 1 && <div className='w-0.5 h-full bg-border mt-2' />}
                  </div>
                  <div className='flex-1 pb-8'>
                    <div className='text-sm text-primary font-medium mb-1'>{item.year}</div>
                    <h3 className='text-xl font-semibold text-foreground mb-2'>{item.title}</h3>
                    <p className='text-muted-foreground'>{item.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-20 bg-muted/50'>
        <div className='container mx-auto px-6 sm:px-10 lg:px-16'>
          <AnimatedSection>
            <div className='text-center mb-12'>
              <span className='inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4'>
                Our Team
              </span>
              <h2 className='text-3xl font-bold text-foreground mb-4'>
                Meet the People Behind Streamline
              </h2>
              <p className='text-muted-foreground max-w-2xl mx-auto'>
                A passionate team dedicated to helping your business succeed.
              </p>
            </div>
          </AnimatedSection>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto'>
            {team.map(member => (
              <AnimatedSection key={member.name}>
                <div className='bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow'>
                  <div className='w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center'>
                    <Users className='h-10 w-10 text-muted-foreground/50' />
                  </div>
                  <h3 className='text-lg font-semibold text-foreground mb-1'>{member.name}</h3>
                  <p className='text-primary text-sm font-medium mb-3'>{member.role}</p>
                  <p className='text-muted-foreground text-sm mb-4'>{member.bio}</p>
                  <div className='flex justify-center gap-3'>
                    <a
                      href='#'
                      className='text-muted-foreground hover:text-primary transition-colors'
                    >
                      <Linkedin className='h-5 w-5' />
                    </a>
                    <a
                      href='#'
                      className='text-muted-foreground hover:text-primary transition-colors'
                    >
                      <Twitter className='h-5 w-5' />
                    </a>
                  </div>
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
                <Award className='h-12 w-12 text-white mx-auto mb-6' />
                <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
                  Join Thousands of Successful Businesses
                </h2>
                <p className='text-xl text-white/80 mb-8 max-w-2xl mx-auto'>
                  Start your free trial today and see why businesses love Streamline Suite.
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <Link
                    href='/signup'
                    className='inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-primary shadow-lg hover:bg-white/90 transition-all'
                  >
                    Start Free Trial
                    <ArrowRight className='h-5 w-5' />
                  </Link>
                  <Link
                    href='/contact-us'
                    className='inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all'
                  >
                    Contact Us
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

export default AboutUsPage
