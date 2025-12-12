'use client'
import React from 'react'
import Login from '@/components/Login'

interface LoginProps {
  onNavigateToSignUp: () => void
}

const LoginPage: React.FC<LoginProps> = ({ onNavigateToSignUp }) => {
  return <Login onNavigateToSignUp={onNavigateToSignUp} />
}

export default LoginPage
