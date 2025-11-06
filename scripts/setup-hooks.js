#!/usr/bin/env node

/**
 * Setup script to initialize Git hooks with Husky
 * This script sets up automatic formatting and linting before commits
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.warn('🔧 Setting up Git hooks with Husky...')

try {
  // Initialize husky (create .husky directory)
  console.warn('📦 Initializing Husky...')
  if (!fs.existsSync('.husky')) {
    execSync('npx husky init', { stdio: 'inherit' })
  } else {
    console.warn('✅ Husky already initialized')
  }

  // Create pre-commit hook file
  console.warn('🪝 Creating pre-commit hook...')
  const huskyDir = '.husky'
  const preCommitPath = path.join(huskyDir, 'pre-commit')

  fs.writeFileSync(
    preCommitPath,
    `#!/bin/sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
`,
    { mode: 0o755 }
  )

  // Create commit-msg hook file
  console.warn('📝 Creating commit-msg hook...')
  const commitMsgPath = path.join(huskyDir, 'commit-msg')

  fs.writeFileSync(
    commitMsgPath,
    `#!/bin/sh
. "$(dirname -- "$0")/_/husky.sh"

npx commitlint --edit "\${1}"
`,
    { mode: 0o755 }
  )

  // Create pre-push hook file
  console.warn('🚀 Creating pre-push hook...')
  const prePushPath = path.join(huskyDir, 'pre-push')

  fs.writeFileSync(
    prePushPath,
    `#!/bin/sh
. "$(dirname -- "$0")/_/husky.sh"

npm run type-check
`,
    { mode: 0o755 }
  )

  console.warn('✅ Git hooks setup complete!')
  console.warn('')
  console.warn('📝 What happens now:')
  console.warn('  • Before commit: Automatic ESLint fix + Prettier formatting')
  console.warn('  • Commit message: Validated with commitlint')
  console.warn('  • Before push: TypeScript type checking')
  console.warn('')
  console.warn('🎉 You can now commit with automatic formatting!')
} catch (error) {
  console.error('❌ Error setting up hooks:', error.message)
  console.warn('')
  console.warn('💡 Manual alternative:')
  console.warn('  Run "npm run pre-commit-check" before committing')
  process.exit(1)
}
