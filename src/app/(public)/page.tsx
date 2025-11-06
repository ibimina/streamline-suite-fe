'use client'
import React from 'react'
import { ClipboardListIcon, CollectionIcon, ChartPieIcon, BriefcaseIcon } from '@/components/Icons'
import Image from 'next/image'

type PublicPage = 'home' | 'features' | 'pricing' | 'about' | 'contact' | 'login' | 'signup'

interface LandingPageProps {
  onNavigate: (page: PublicPage) => void
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className='relative pl-16'>
    <dt className='text-base font-semibold leading-7 text-gray-900 dark:text-white'>
      <div className='absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500'>
        {icon}
      </div>
      {title}
    </dt>
    <dd className='mt-2 text-base leading-7 text-gray-600 dark:text-gray-300'>{description}</dd>
  </div>
)

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <>
      {/* Hero Section */}
      <div className='relative isolate px-6 pt-14 lg:px-8'>
        <div
          className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
          aria-hidden='true'
        >
          <div
            className='relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#14b8a6] to-[#0d9488] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75'
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          ></div>
        </div>
        <div className='mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl'>
              The All-in-One Platform to Run Your Business
            </h1>
            <p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300'>
              Streamline Suite is the complete toolkit for quotes, invoices, inventory, and
              analytics. Stop juggling multiple apps and run your entire operation from one
              powerful, intuitive platform.
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <button
                onClick={() => onNavigate('pricing')}
                className='rounded-md bg-teal-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600'
              >
                View Plans & Pricing
              </button>
              <button
                onClick={() => onNavigate('features')}
                className='text-sm font-semibold leading-6 text-gray-900 dark:text-white'
              >
                See features <span aria-hidden='true'>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview Section */}
      <div className='overflow-hidden bg-white dark:bg-gray-800 py-24 sm:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl lg:text-center'>
            <h2 className='text-base font-semibold leading-7 text-teal-600 dark:text-teal-400'>
              Everything in One Place
            </h2>
            <p className='mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
              Focus on your craft, not your paperwork
            </p>
          </div>
          <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:grid lg:max-w-7xl lg:grid-cols-5 lg:items-center lg:gap-x-8'>
            <div className='lg:col-span-2 lg:pt-4'>
              <div className='lg:max-w-lg'>
                <p className='text-lg leading-8 text-gray-600 dark:text-gray-300'>
                  From the first quote to the final payment, Streamline Suite provides the tools you
                  need to manage your business efficiently and professionally.
                </p>
                <dl className='mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none'>
                  <FeatureCard
                    icon={<ClipboardListIcon className='h-6 w-6 text-white' />}
                    title='Effortless Quoting & Invoicing'
                    description='Create professional quotes in minutes. Convert them to invoices with a single click and track payments automatically.'
                  />
                  <FeatureCard
                    icon={<CollectionIcon className='h-6 w-6 text-white' />}
                    title='Simplified Inventory Control'
                    description='Manage stock levels, track item movements, and automatically update your inventory when you make a sale.'
                  />
                  <FeatureCard
                    icon={<BriefcaseIcon className='h-6 w-6 text-white' />}
                    title='Organized Staff Management'
                    description='Keep all your employee records in one place, manage roles, and streamline payroll processes.'
                  />
                  <FeatureCard
                    icon={<ChartPieIcon className='h-6 w-6 text-white' />}
                    title='Powerful Analytics'
                    description='Get a clear view of your sales, profits, and expenses. Make data-driven decisions to grow your business faster.'
                  />
                </dl>
              </div>
            </div>
            <Image
              src='https://images.unsplash.com/photo-1537511446984-935f663eb1f4?q=80&w=2070&auto=format&fit=crop'
              alt='App screenshot'
              className='mt-12 w-full rounded-xl shadow-xl ring-1 ring-gray-400/10 lg:col-span-3 lg:mt-0'
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default LandingPage
