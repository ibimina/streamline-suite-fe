#!/usr/bin/env node

/**
 * Manual pre-commit script
 * Run this before committing to ensure code quality
 */

const { execSync } = require('child_process')

console.warn('🧹 Running pre-commit checks...')

try {
  console.warn('1️⃣ Formatting with Prettier...')
  execSync('npm run format', { stdio: 'inherit' })

  console.warn('2️⃣ Linting with ESLint...')
  execSync('npm run lint', { stdio: 'inherit' })

  console.warn('3️⃣ Type checking with TypeScript...')
  execSync('npm run type-check', { stdio: 'inherit' })

  console.warn('✅ All checks passed! Ready to commit.')
} catch (error) {
  console.error('❌ Pre-commit checks failed:', error.message)
  console.warn('')
  console.warn('💡 Fix the issues above before committing.')
  process.exit(1)
}
