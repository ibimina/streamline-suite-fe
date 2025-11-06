import React, { useId } from 'react'

type LogoProps = {
  className?: string
}

const Logo: React.FC<LogoProps> = props => {
  const gradientId = useId()

  return (
    <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <defs>
        <linearGradient id={gradientId} x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='#14B8A6' />
          <stop offset='100%' stopColor='#0D9488' />
        </linearGradient>
      </defs>
      <path
        d='M17 5H9.48151C6.96336 5 4.90374 7.05962 4.90374 9.57777V9.57777C4.90374 12.1316 6.96336 14.1912 9.48151 14.1912H17'
        stroke={`url(#${gradientId})`}
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7 19L14.5185 19C17.0366 19 19.0963 16.9404 19.0963 14.4222V14.4222C19.0963 11.8684 17.0366 9.80878 14.5185 9.80878H7'
        stroke={`url(#${gradientId})`}
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default Logo
